/* =========================================================
   CYSCOMP — dados do site
   Fontes: Proposta de Formação e Certificação, Portfólio
   Institucional 2026 e plano editorial de Outubro 2026.
   ========================================================= */
window.CYS = window.CYS || {};

/* ---------- Catálogo de formação ---------- */
CYS.categorias = [
  { id: 'ec', nome: 'Certificações EC-Council', resumo: '1.º revendedor autorizado EC-Council em Angola. Curso oficial, laboratórios práticos, material de estudo e voucher de exame internacional.' },
  { id: 'comptia', nome: 'Certificações CompTIA', resumo: 'Parceiro CompTIA. Certificações neutras em relação a fabricantes, dos fundamentos ao nível avançado.' },
  { id: 'tecnicos', nome: 'Cursos técnicos', resumo: 'Formações práticas com carga horária e duração definidas, em segurança ofensiva, defesa, infra-estrutura e gestão.' },
  { id: 'bootcamps', nome: 'Bootcamps', resumo: 'Programas imersivos que terminam com um projecto real.' }
];

CYS.cursos = [
  /* EC-Council (19) */
  { id: 'ceh', cat: 'ec', sigla: 'CEH', nome: 'Certified Ethical Hacker', area: 'Segurança ofensiva', nivel: 'Intermédio', img: 'assets/img/certs/ceh.jpg', destaque: true,
    desc: 'O padrão mundial em hacking ético: reconhecimento, exploração, pós-exploração e mitigação de vulnerabilidades em ambientes reais de laboratório.' },
  { id: 'cpent', cat: 'ec', sigla: 'CPENT', nome: 'Certified Penetration Testing Professional', area: 'Segurança ofensiva', nivel: 'Avançado', img: 'assets/img/certs/cpent.jpg',
    desc: 'Testes de intrusão avançados em redes segmentadas, IoT, OT e ambientes empresariais complexos.' },
  { id: 'chfi', cat: 'ec', sigla: 'CHFI', nome: 'Computer Hacking Forensic Investigator', area: 'Forense digital', nivel: 'Intermédio', img: 'assets/img/certs/chfi.jpg',
    desc: 'Investigação forense digital, recolha e preservação de prova, e análise de incidentes para apoio jurídico.' },
  { id: 'ecih', cat: 'ec', sigla: 'E|CIH', nome: 'EC-Council Certified Incident Handler', area: 'Resposta a incidentes', nivel: 'Intermédio', img: 'assets/img/certs/ecih.jpg', destaque: true,
    desc: 'Preparação, detecção, contenção, erradicação e recuperação de incidentes de segurança com método.' },
  { id: 'cnd', cat: 'ec', sigla: 'CND', nome: 'Certified Network Defender', area: 'Defesa de redes', nivel: 'Intermédio', img: 'assets/img/certs/cnd.jpg',
    desc: 'Protecção, detecção e resposta em redes corporativas: controlos, monitorização e boas práticas defensivas.' },
  { id: 'csa', cat: 'ec', sigla: 'CSA', nome: 'Certified SOC Analyst', area: 'SOC', nivel: 'Intermédio', img: 'assets/img/certs/csa.jpg', destaque: true,
    desc: 'Operações de um Centro de Operações de Segurança: SIEM, triagem de alertas, investigação e escalonamento.' },
  { id: 'ctia', cat: 'ec', sigla: 'CTIA', nome: 'Certified Threat Intelligence Analyst', area: 'Threat intelligence', nivel: 'Avançado', img: 'assets/img/certs/ctia.jpg',
    desc: 'Recolha, análise e aplicação de informação sobre ameaças para antecipar ataques.' },
  { id: 'cciso', cat: 'ec', sigla: 'C|CISO', nome: 'Certified Chief Information Security Officer', area: 'Gestão executiva', nivel: 'Executivo', img: 'assets/img/certs/cciso.jpg',
    desc: 'Governação, risco, programas de segurança e liderança para responsáveis de segurança da informação.' },
  { id: 'cct', cat: 'ec', sigla: 'CCT', nome: 'Certified Cybersecurity Technician', area: 'Fundamentos', nivel: 'Iniciação', desc: 'Competências técnicas de base para iniciar uma carreira em cibersegurança.' },
  { id: 'cscu', cat: 'ec', sigla: 'CSCU', nome: 'Certified Secure Computer User', area: 'Sensibilização', nivel: 'Iniciação', desc: 'Utilização segura de computadores, e-mail, redes sociais e dispositivos móveis.' },
  { id: 'wahs', cat: 'ec', sigla: 'WAHS', nome: 'Web Application Hacking and Security', area: 'Segurança aplicacional', nivel: 'Intermédio', desc: 'Ataque e defesa de aplicações web, das falhas OWASP à correcção.' },
  { id: 'edrp', cat: 'ec', sigla: 'EDRP', nome: 'EC-Council Disaster Recovery Professional', area: 'Continuidade', nivel: 'Intermédio', desc: 'Planos de continuidade de negócio e recuperação de desastres.' },
  { id: 'ccse', cat: 'ec', sigla: 'CCSE', nome: 'Certified Cloud Security Engineer', area: 'Cloud', nivel: 'Intermédio', desc: 'Segurança em ambientes cloud públicos, privados e híbridos.' },
  { id: 'cbpd', cat: 'ec', sigla: 'CBPD', nome: 'Certified Blockchain Professional', area: 'Blockchain', nivel: 'Intermédio', desc: 'Fundamentos, arquitectura e segurança de soluções blockchain.' },
  { id: 'case-java', cat: 'ec', sigla: 'CASE Java', nome: 'Certified Application Security Engineer — Java', area: 'Desenvolvimento seguro', nivel: 'Intermédio', desc: 'Ciclo de desenvolvimento seguro em aplicações Java.' },
  { id: 'case-net', cat: 'ec', sigla: 'CASE .NET', nome: 'Certified Application Security Engineer — .NET', area: 'Desenvolvimento seguro', nivel: 'Intermédio', desc: 'Ciclo de desenvolvimento seguro em aplicações .NET.' },
  { id: 'eces', cat: 'ec', sigla: 'ECES', nome: 'EC-Council Certified Encryption Specialist', area: 'Criptografia', nivel: 'Intermédio', desc: 'Algoritmos, protocolos e aplicação prática da criptografia.' },
  { id: 'ecde', cat: 'ec', sigla: 'ECDE', nome: 'EC-Council Certified DevSecOps Engineer', area: 'DevSecOps', nivel: 'Avançado', desc: 'Segurança integrada em pipelines de desenvolvimento e operações.' },
  { id: 'ics-scada', cat: 'ec', sigla: 'ICS-SCADA', nome: 'Industrial Control Systems — SCADA', area: 'OT / Indústria', nivel: 'Avançado', desc: 'Segurança de sistemas de controlo industrial, essencial para energia, petróleo e utilities.' },

  /* CompTIA (18) */
  { id: 'tech-plus', cat: 'comptia', sigla: 'Tech+', nome: 'CompTIA Tech+', area: 'Fundamentos', nivel: 'Iniciação', desc: 'Primeiros passos em tecnologia e TI.' },
  { id: 'a-plus', cat: 'comptia', sigla: 'A+', nome: 'CompTIA A+', area: 'Fundamentos', nivel: 'Iniciação', desc: 'Suporte técnico e manutenção de sistemas.' },
  { id: 'network-plus', cat: 'comptia', sigla: 'Network+', nome: 'CompTIA Network+', area: 'Fundamentos', nivel: 'Iniciação', desc: 'Configuração e gestão de redes.' },
  { id: 'security-plus', cat: 'comptia', sigla: 'Security+', nome: 'CompTIA Security+', area: 'Fundamentos', nivel: 'Iniciação', destaque: true, desc: 'A base essencial em cibersegurança, reconhecida internacionalmente.' },
  { id: 'server-plus', cat: 'comptia', sigla: 'Server+', nome: 'CompTIA Server+', area: 'Infra-estrutura', nivel: 'Intermédio', desc: 'Administração de servidores.' },
  { id: 'linux-plus', cat: 'comptia', sigla: 'Linux+', nome: 'CompTIA Linux+', area: 'Infra-estrutura', nivel: 'Intermédio', desc: 'Administração de sistemas Linux.' },
  { id: 'cloud-plus', cat: 'comptia', sigla: 'Cloud+', nome: 'CompTIA Cloud+', area: 'Infra-estrutura', nivel: 'Intermédio', desc: 'Operação de infra-estruturas cloud.' },
  { id: 'autoops-plus', cat: 'comptia', sigla: 'AutoOps+', nome: 'CompTIA AutoOps+', area: 'Infra-estrutura', nivel: 'Intermédio', desc: 'Automação de operações e DevOps.' },
  { id: 'cloudnetx', cat: 'comptia', sigla: 'CloudNetX', nome: 'CompTIA CloudNetX', area: 'Infra-estrutura', nivel: 'Avançado', desc: 'Redes híbridas seguras.' },
  { id: 'cysa-plus', cat: 'comptia', sigla: 'CySA+', nome: 'CompTIA CySA+', area: 'Cibersegurança', nivel: 'Intermédio', desc: 'Detecção e resposta a ameaças.' },
  { id: 'pentest-plus', cat: 'comptia', sigla: 'PenTest+', nome: 'CompTIA PenTest+', area: 'Cibersegurança', nivel: 'Intermédio', desc: 'Testes de intrusão e relatórios.' },
  { id: 'secai-plus', cat: 'comptia', sigla: 'SecAI+', nome: 'CompTIA SecAI+', area: 'Cibersegurança', nivel: 'Intermédio', desc: 'Segurança de sistemas de inteligência artificial.' },
  { id: 'secot-plus', cat: 'comptia', sigla: 'SecOT+', nome: 'CompTIA SecOT+', area: 'Cibersegurança', nivel: 'Intermédio', etiqueta: 'Pré-venda · Dez. 2026', desc: 'Segurança de sistemas industriais (OT). Lançamento previsto para Dezembro de 2026.' },
  { id: 'securityx', cat: 'comptia', sigla: 'SecurityX', nome: 'CompTIA SecurityX', area: 'Cibersegurança', nivel: 'Avançado', desc: 'Arquitectura de segurança.' },
  { id: 'data-plus', cat: 'comptia', sigla: 'Data+', nome: 'CompTIA Data+', area: 'Dados e gestão', nivel: 'Intermédio', desc: 'Análise e comunicação de dados.' },
  { id: 'datasys-plus', cat: 'comptia', sigla: 'DataSys+', nome: 'CompTIA DataSys+', area: 'Dados e gestão', nivel: 'Intermédio', desc: 'Administração de bases de dados.' },
  { id: 'dataai', cat: 'comptia', sigla: 'DataAI', nome: 'CompTIA DataAI', area: 'Dados e gestão', nivel: 'Avançado', desc: 'Ciência de dados.' },
  { id: 'project-plus', cat: 'comptia', sigla: 'Project+', nome: 'CompTIA Project+', area: 'Dados e gestão', nivel: 'Intermédio', desc: 'Gestão de projectos de TI.' },

  /* Cursos técnicos (21) */
  { id: 'analise-malware', cat: 'tecnicos', nome: 'Análise de Malware', area: 'Cibersegurança e segurança ofensiva', horas: 20, dias: 5, desc: 'Identificar, desmontar e analisar código malicioso em ambiente controlado.' },
  { id: 'deteccao-intrusao', cat: 'tecnicos', nome: 'Detecção de Intrusão', area: 'Cibersegurança e segurança ofensiva', horas: 20, dias: 5, desc: 'IDS/IPS, assinaturas e análise de tráfego para detectar ataques em curso.' },
  { id: 'resposta-incidentes', cat: 'tecnicos', nome: 'Resposta a Incidentes de Segurança', area: 'Cibersegurança e segurança ofensiva', horas: 30, dias: 6, desc: 'Conter, erradicar e recuperar com método, do primeiro alerta ao relatório final.' },
  { id: 'soc-avancado', cat: 'tecnicos', nome: 'SOC Avançado', area: 'Cibersegurança e segurança ofensiva', horas: 50, dias: 10, destaque: true, desc: 'Monitorização, correlação SIEM, threat hunting e operação de um SOC real.' },
  { id: 'pentest-profissional', cat: 'tecnicos', nome: 'Pentest Profissional', area: 'Cibersegurança e segurança ofensiva', horas: 45, dias: 8, destaque: true, desc: 'Identificar e explorar vulnerabilidades em sistemas, redes e aplicações com técnicas avançadas.' },
  { id: 'pentest-web', cat: 'tecnicos', nome: 'Pentest Web', area: 'Cibersegurança e segurança ofensiva', horas: 20, dias: 5, desc: 'Testes de intrusão em aplicações web: OWASP Top 10, autenticação e lógica de negócio.' },
  { id: 'wifi-hacking', cat: 'tecnicos', nome: 'Wi-Fi Hacking', area: 'Cibersegurança e segurança ofensiva', horas: 20, dias: 5, desc: 'Ataque e protecção de redes sem fios.' },
  { id: 'mobile-hacking', cat: 'tecnicos', nome: 'Mobile Hacking', area: 'Cibersegurança e segurança ofensiva', horas: 30, dias: 6, desc: 'Segurança de aplicações Android e iOS.' },
  { id: 'hardware-hacking', cat: 'tecnicos', nome: 'Hardware Hacking', area: 'Cibersegurança e segurança ofensiva', horas: 45, dias: 8, desc: 'Análise e exploração de dispositivos físicos e firmware.' },
  { id: 'forense-digital', cat: 'tecnicos', nome: 'Investigação Forense Digital', area: 'Cibersegurança e segurança ofensiva', horas: 45, dias: 8, desc: 'Recolha, preservação e análise de prova digital.' },
  { id: 'dfir', cat: 'tecnicos', nome: 'Digital Forensics & Incident Response (DFIR)', area: 'Cibersegurança e segurança ofensiva', etiqueta: 'Inscrições abertas', destaque: true, desc: 'Investigação forense e resposta a incidentes com relatório técnico. Nesta edição, o participante com melhor desempenho habilita-se a ganhar a certificação E|CIH da EC-Council.' },
  { id: 'bootcamp-ciber', cat: 'tecnicos', nome: 'Bootcamp de Cibersegurança', area: 'Cibersegurança e segurança ofensiva', desc: 'Formação intensiva e imersiva. Carga horária sob consulta.' },
  { id: 'admin-linux', cat: 'tecnicos', nome: 'Administração Linux', area: 'Infra-estruturas e sistemas', horas: 40, dias: 7, desc: 'Gestão de servidores Linux em produção.' },
  { id: 'fund-linux', cat: 'tecnicos', nome: 'Fundamentos de Linux', area: 'Infra-estruturas e sistemas', horas: 20, dias: 5, desc: 'Linha de comandos, sistema de ficheiros, utilizadores e serviços.' },
  { id: 'windows-server', cat: 'tecnicos', nome: 'Windows Server', area: 'Infra-estruturas e sistemas', horas: 40, dias: 7, desc: 'Active Directory, políticas de grupo e serviços de rede.' },
  { id: 'redes', cat: 'tecnicos', nome: 'Redes de Computadores', area: 'Infra-estruturas e sistemas', horas: 20, dias: 5, desc: 'Modelos OSI e TCP/IP, endereçamento, routing e switching.' },
  { id: 'dev-seguro', cat: 'tecnicos', nome: 'Desenvolvimento de Software Seguro', area: 'Desenvolvimento e boas práticas', horas: 35, dias: 6, desc: 'Escrever código resistente a ataques desde o primeiro commit.' },
  { id: 'fund-ciber', cat: 'tecnicos', nome: 'Fundamentos de Cibersegurança', area: 'Desenvolvimento e boas práticas', horas: 20, dias: 5, desc: 'O ponto de partida para quem quer entrar na área.' },
  { id: 'gestao-projectos', cat: 'tecnicos', nome: 'Gestão de Projectos', area: 'Gestão e utilização', horas: 40, dias: 7, desc: 'Metodologias de gestão de projectos, ágeis e tradicionais.' },
  { id: 'informatica-utilizador', cat: 'tecnicos', nome: 'Informática na Óptica do Utilizador', area: 'Gestão e utilização', horas: 60, dias: 10, desc: 'Ferramentas de produtividade para o dia-a-dia profissional.' },
  { id: 'cctv', cat: 'tecnicos', nome: 'CCTV — Sistemas de Videovigilância', area: 'Tecnologias complementares', horas: 60, dias: 10, desc: 'Projecto, instalação e gestão de sistemas de videovigilância.' },

  /* Bootcamps (3) */
  { id: 'zero-to-hero', cat: 'bootcamps', nome: 'Cyber Security Professional: From Zero to Hero', area: 'Cibersegurança', destaque: true, desc: 'Do zero ao nível profissional em cibersegurança, com projecto final real.' },
  { id: 'fullstack', cat: 'bootcamps', nome: 'Full Stack: Angular e NestJS', area: 'Desenvolvimento web', desc: 'Do front-end ao back-end. Projecto final: loja online.' },
  { id: 'dotnet', cat: 'bootcamps', nome: 'Desenvolvimento .NET', area: 'Desenvolvimento', desc: 'Aplicações empresariais na plataforma .NET. Projecto final: sistema de gestão.' }
];

CYS.curso = (id) => CYS.cursos.find((c) => c.id === id);

/* ---------- Notícias (factos do plano editorial e documentos da CYSCOMP) ---------- */
CYS.noticias = [
  {
    id: 'parceria-comptia', data: '2026-10-16', tag: 'Parceria', img: 'assets/img/photos/formandos.jpg',
    titulo: 'A CYSCOMP é agora parceira CompTIA',
    resumo: 'Juntamos a CompTIA à EC-Council: dois percursos complementares para formar profissionais angolanos com reconhecimento internacional.',
    corpo: [
      'A CompTIA é uma das maiores organizações mundiais de certificação em tecnologias de informação, com certificações neutras em relação a fabricantes e reconhecidas em vários países.',
      'Com esta parceria, a CYSCOMP passa a disponibilizar o catálogo CompTIA, dos fundamentos (Tech+, A+, Network+, Security+) ao nível avançado (CySA+, PenTest+, SecurityX), incluindo as novas SecAI+ e SecOT+.',
      'Somando as 19 certificações EC-Council, das quais somos o 1.º revendedor autorizado em Angola, os profissionais e as organizações passam a ter num só parceiro os dois percursos de certificação mais procurados do mercado.'
    ]
  },
  {
    id: 'lei-ciberseguranca', data: '2026-09-28', tag: 'Regulação', img: 'assets/img/photos/executiva.jpg',
    titulo: 'Lei n.º 9/26: Angola tem uma nova Lei da Cibersegurança',
    resumo: 'A Lei n.º 9/26, de 28 de Setembro, estabelece o Regime Jurídico da Cibersegurança e revoga a Lei n.º 7/17. O que deve cada organização avaliar agora?',
    corpo: [
      'A Lei n.º 9/26, de 28 de Setembro — Lei da Cibersegurança da República de Angola — estabelece o Regime Jurídico da Cibersegurança e revoga a Lei n.º 7/17, de 16 de Fevereiro.',
      'Cada organização deve avaliar que obrigações lhe são aplicáveis em matéria de gestão de risco, requisitos de segurança, registo e notificação de incidentes. As obrigações variam consoante a categoria da entidade.',
      'A CYSCOMP apoia as organizações com uma reunião de diagnóstico e levantamento de necessidades, para definir prioridades. A contratação de serviços não constitui, por si só, garantia automática de conformidade legal: cada caso deve ser analisado.'
    ]
  },
  {
    id: 'dfir-ecih', data: '2026-10-13', tag: 'Academia', img: 'assets/img/photos/forense.jpg', video: 'assets/video/dfir.mp4',
    titulo: 'Inscrições abertas para o curso DFIR, com desafio E|CIH',
    resumo: 'Nesta edição, o participante com melhor desempenho habilita-se a ganhar a certificação E|CIH, Certified Incident Handler, da EC-Council.',
    corpo: [
      'Estão abertas as inscrições para o curso de DFIR (Digital Forensics and Incident Response) da CYSCOMP.',
      'Ao longo da formação, os participantes desenvolvem competências em investigação forense digital (recolher e analisar evidências de um incidente), resposta a incidentes (conter, erradicar e recuperar com método) e relatório técnico (explicar o que aconteceu de forma clara e credível).',
      'Mais do que uma formação, é a oportunidade de competir por uma certificação reconhecida internacionalmente.'
    ]
  },
  {
    id: 'mes-ciberseguranca', data: '2026-10-01', tag: 'Comunidade', img: 'assets/img/photos/reuniao.jpg',
    titulo: 'Outubro, Mês da Cibersegurança: 31 dias de conteúdos',
    resumo: 'Durante todo o mês de Outubro, a CYSCOMP partilhou diariamente dicas práticas, frases e conteúdos educativos com a comunidade.',
    corpo: [
      'Outubro é o mês internacional da sensibilização para a cibersegurança. A CYSCOMP assinalou-o com uma publicação por dia e conteúdos educativos sobre e-mails comprometidos, golpes no WhatsApp, engenharia social, palavras-passe, backups e resposta a incidentes.',
      'Porque ninguém protege aquilo que não compreende.'
    ]
  },
  {
    id: 'na-tua-provincia', data: '2026-09-29', tag: 'Programa', img: 'assets/img/photos/turma.jpg',
    titulo: 'CYSCOMP na Tua Província: formação nas 21 províncias',
    resumo: 'Master classes, workshops práticos, palestras de sensibilização e formação certificada, levados às 21 províncias de Angola mediante solicitação.',
    corpo: [
      'A cibersegurança não pode ficar só em Luanda. Com o programa CYSCOMP na Tua Província, levamos formadores, conteúdo e método às 21 províncias de Angola.',
      'Quatro formatos: master class, workshop prático, palestra de sensibilização e formação certificada EC-Council.',
      'Como funciona: a instituição faz o pedido (província, público e formato), a CYSCOMP envia o programa e as condições, acertam-se a data, o local e os participantes, e os formadores vão até si.'
    ]
  },
  {
    id: 'outsourcing', data: '2026-09-29', tag: 'Serviço', img: 'assets/img/photos/soc-analista.jpg',
    titulo: 'Novo serviço: Outsourcing de Técnicos de Cibersegurança',
    resumo: 'Profissionais qualificados, seleccionados, formados e acompanhados pela CYSCOMP, a trabalhar na sua organização.',
    corpo: [
      'Contratar um especialista demora meses. Um incidente demora minutos.',
      'Com o Outsourcing de Técnicos da CYSCOMP, a sua organização conta com profissionais qualificados para um projecto, uma substituição ou de forma contínua, sem processo de recrutamento do seu lado. O técnico trabalha para si; a gestão e a actualização técnica ficam connosco.'
    ]
  },
  {
    id: 'webinar-vulnerabilidades', data: '2026-09-26', tag: 'Webinar', img: 'assets/img/photos/datacenter.jpg',
    titulo: 'Webinar: Gestão de Vulnerabilidades — Conceitos, Normas e Prática',
    resumo: 'Do ciclo de vida da gestão de vulnerabilidades à prática com OpenVAS, com Geovane Baptista.',
    corpo: [
      'O webinar percorreu o ciclo de vida da gestão de vulnerabilidades (descoberta, classificação, priorização, remediação, verificação e reporte), as normas e frameworks de referência (ISO/IEC 27001:2022, NIST, CIS Controls, CVE/CVSS) e uma demonstração prática com OpenVAS.',
      'Foi apresentado por Geovane Baptista, engenheiro informático com certificações eJPT, CySA+, ISO/IEC 27001 Foundation e ISO/IEC 27035 Lead Incident Manager.'
    ]
  },
  {
    id: 'ciberseguranca-em-debate', data: '2026-08-23', tag: 'Evento', img: 'assets/img/photos/executivo.jpg',
    titulo: 'Cibersegurança em Debate: desafios, ameaças e estratégias',
    resumo: 'Uma sessão sobre o novo cenário digital: quem nos ameaça, como defender e responder, e a maturidade das organizações angolanas.',
    corpo: [
      'Em 2026, a exploração de vulnerabilidades ultrapassou pela primeira vez o roubo de credenciais como principal vector de acesso inicial: 31% das violações (Verizon DBIR 2026). O tempo médio para identificar e conter uma violação foi de 241 dias (IBM Cost of a Data Breach 2025).',
      'A sessão abordou o novo cenário digital, os actores de ameaça, as estratégias de defesa e resposta (SOC, incident response, forense) e a visão estratégica para Angola. A pergunta não é “se” seremos alvo, mas “estamos preparados para quando acontecer?”.'
    ]
  }
];

/* ---------- Registo de certificados ----------
   Em produção, a verificação deve consultar o servidor da CYSCOMP
   (definir window.CYS_VERIFY_ENDPOINT). Os registos abaixo são apenas
   de demonstração do fluxo e estão identificados como tal. */
CYS.certificadosDemo = {
  'CYS-2026-DEMO1': { nome: 'Formando de Demonstração', curso: 'Pentest Profissional', horas: 45, emissao: '2026-07-18', estado: 'valido', demo: true },
  'CYS-2026-DEMO2': { nome: 'Formanda de Demonstração', curso: 'SOC Avançado', horas: 50, emissao: '2026-09-05', estado: 'valido', demo: true }
};

/* ---------- Clientes e parceiros (Portfólio Institucional 2026) ---------- */
CYS.parceiros = [
  { nome: 'EC-Council', logo: 'eccouncil', nota: '1.º revendedor autorizado em Angola' },
  { nome: 'CompTIA', logo: 'comptia', nota: 'Parceiro oficial' },
  { nome: 'Huawei', logo: 'huawei' },
  { nome: 'INEFOP', logo: 'inefop' },
  { nome: 'Telegest', logo: 'telegest' },
  { nome: 'Ekanda TV', logo: 'ekanda' },
  { nome: 'Dona Software', logo: 'dona-software' }
];
CYS.clientes = [
  { nome: 'BAI', logo: 'bai' }, { nome: 'Nossa Seguros', logo: 'nossa' }, { nome: 'A Mundial Seguros', logo: 'mundial' },
  { nome: 'Promasidor', logo: 'promasidor' }, { nome: 'Clínica Multiperfil', logo: 'multiperfil' }, { nome: 'União', logo: 'uniao' },
  { nome: 'Tribunal Municipal de Viana', logo: 'tribunal-viana' }, { nome: 'Mansa Musa Brokers', logo: 'mansa-musa' }, { nome: 'CETIM', logo: 'cetim' },
  { nome: 'IMANI, Lda', logo: 'imani' }, { nome: 'MicroLab', logo: 'microlab' }, { nome: 'UCALL', logo: 'ucall' },
  { nome: 'ATIS Nebest Angola', logo: 'atis-nebest' }, { nome: 'Afrizona', logo: 'afrizona' }, { nome: 'Anjani', logo: 'anjani' }
];

CYS.provincias = ['Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cuando', 'Cuanza Norte', 'Cuanza Sul', 'Cubango', 'Cunene', 'Huambo', 'Huíla', 'Icolo e Bengo', 'Luanda', 'Lunda Norte', 'Lunda Sul', 'Malanje', 'Moxico', 'Moxico Leste', 'Namibe', 'Uíge', 'Zaire'];

CYS.fmtData = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' });
