(function configurarPolitica(globalScope) {
  'use strict';

  const TAXONOMIA = Object.freeze({
    dados: Object.freeze(['publico', 'interno', 'pessoal', 'credencial', 'externo']),
    ambientes: Object.freeze(['desenvolvimento', 'homologacao', 'producao']),
    autonomias: Object.freeze(['leitura', 'proposta', 'edicao', 'execucao', 'critica'])
  });

  const ROTULOS = Object.freeze({
    permitido: 'Permitido',
    condicionado: 'Exige condições',
    'nao-autorizado': 'Não autorizado'
  });

  function normalizar(valor) {
    return String(valor ?? '')
      .trim()
      .toLocaleLowerCase('pt-BR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function validar(campo, valor, aceitos) {
    if (!aceitos.includes(valor)) {
      throw new TypeError(`${campo} inválido: ${valor || '(vazio)'}`);
    }
  }

  function resultado(status, motivo, regra, risco, controles) {
    return Object.freeze({ status, label: ROTULOS[status], motivo, regra, risco, controles: Object.freeze(controles) });
  }

  function avaliar(entrada) {
    const dados = normalizar(entrada?.dados);
    const ambiente = normalizar(entrada?.ambiente);
    const autonomia = normalizar(entrada?.autonomia);

    validar('Tipo de dado', dados, TAXONOMIA.dados);
    validar('Ambiente', ambiente, TAXONOMIA.ambientes);
    validar('Autonomia', autonomia, TAXONOMIA.autonomias);

    if (dados === 'credencial' || dados === 'pessoal' || autonomia === 'critica') {
      return resultado(
        'nao-autorizado',
        'Credenciais, dados pessoais e ações críticas ficam fora do piloto.',
        'R1',
        'Crítico',
        ['Interromper a solicitação', 'Remover dados sensíveis', 'Submeter o caso à autoridade competente']
      );
    }

    if (ambiente === 'producao' && (autonomia === 'edicao' || autonomia === 'execucao')) {
      return resultado(
        'nao-autorizado',
        'Edição ou execução em produção não é autorizada neste exercício.',
        'R2',
        'Crítico',
        ['Bloquear execução automática', 'Exigir segregação de funções', 'Definir plano de reversão e autorização formal']
      );
    }

    if (ambiente === 'producao') {
      return resultado(
        'condicionado',
        'Em produção, leitura e proposta exigem revisão e controles prévios.',
        'R3',
        'Alto',
        ['Confirmar ambiente homologado', 'Registrar revisão humana', 'Limitar o acesso ao mínimo necessário']
      );
    }

    if (
      dados === 'interno' ||
      dados === 'externo' ||
      ambiente === 'homologacao' ||
      autonomia === 'edicao' ||
      autonomia === 'execucao'
    ) {
      return resultado(
        'condicionado',
        'O cenário exige supervisão humana e condições de segurança definidas.',
        'R4',
        'Moderado',
        ['Definir finalidade e responsável', 'Aplicar minimização dos dados', 'Documentar revisão e evidências']
      );
    }

    return resultado(
      'permitido',
      'Dados públicos em desenvolvimento, apenas para leitura ou proposta didática.',
      'R5',
      'Baixo',
      ['Manter conferência humana', 'Registrar a finalidade', 'Não incluir informações restritas']
    );
  }

  globalScope.GOVSAFE_POLICY = Object.freeze({ avaliar, normalizar, TAXONOMIA });
})(globalThis);
