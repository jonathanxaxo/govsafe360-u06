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

  function resultado(status, motivo, regra) {
    return Object.freeze({ status, label: ROTULOS[status], motivo, regra });
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
        'R1'
      );
    }

    if (ambiente === 'producao' && (autonomia === 'edicao' || autonomia === 'execucao')) {
      return resultado(
        'nao-autorizado',
        'Edição ou execução em produção não é autorizada neste exercício.',
        'R2'
      );
    }

    if (ambiente === 'producao') {
      return resultado(
        'condicionado',
        'Em produção, leitura e proposta exigem revisão e controles prévios.',
        'R3'
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
        'R4'
      );
    }

    return resultado(
      'permitido',
      'Dados públicos em desenvolvimento, apenas para leitura ou proposta didática.',
      'R5'
    );
  }

  globalScope.GOVSAFE_POLICY = Object.freeze({ avaliar, normalizar, TAXONOMIA });
})(globalThis);
