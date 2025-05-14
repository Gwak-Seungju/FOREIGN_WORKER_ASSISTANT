export type OnboardingItem = {
  id: string;
  title: string;
  image?: any;
  checklist?: {
    type: 'checkbox' | 'sequence';
    items: {
      text: string;
      checked?: boolean; // 기본값 false
    }[];
  };
  relatedLink?: {
    title: string,
    link: string,
    country?: '태국' | '베트남',
  }[];
};

export const ONBOARDINGDATA: OnboardingItem[] = [
  {
    id: '1',
    title: '사전 자격 조건을 확인할게요',
    checklist: {
      type: 'checkbox',
      items: [
        { text: '현재 나이가 만 18세 이상 39세 이하 인가요?' },
        { text: '범죄 경력이 없고, 출국에 결격사유가 없나요?' },
        { text: '전염 병이나 심각한 질병 없이 건강한 상태인가요?' },
        { text: '해외 취업이 금지되거나 후에 귀국한 상태가 아닌가요?' },
      ],
    },
  },
  {
    id: '2',
    title: '필수 서류를 준비해주세요',
    checklist: {
      type: 'checkbox',
      items: [
        { text: '여권 사본' },
        { text: '신분증 사본' },
        { text: '증명 사진' },
        { text: '최종 학력증명서' },
        { text: '건강 상태 확인서' },
      ],
    },
  },
  {
    id: '3',
    title: '구직자 명부 등록(EPS 등록)을 진행해주세요',
    checklist: {
      type: 'sequence',
      items: [
        { text: '등록 일정 공지를 확인하세요' },
        { text: '준비한 서류를 지참하세요' },
        { text: '사전 문자인증 등이 가능한 환경 진행하시고 기관은 방문하세요' },
        { text: '등록 신청서를 작성하고 서류를 제출하세요' },
      ],
    },
  },
  {
    id: '4',
    title: 'EPS-TOPIK 시험을 응시하세요',
    image: require('../assets/checklist/eps-topik.png'),
    relatedLink: [
      {
        title: '원서접수 링크',
        link: "https://epstopik.hrdkorea.or.kr/epstopik/recp/guide/onlineRecptionDesc.do?lang=en",
      },
      {
        title: '응시일정 링크',
        link: "https://epstopik.hrdkorea.or.kr/epstopik/home/main/mainPage.do?lang=en",
      },
      {
        title: '합격자발표 링크',
        link: "https://epstopik.hrdkorea.or.kr/epstopik/pass/candidate/sucessCandidateList.do?lang=en",
      }
    ]
  },
  {
    id: '5',
    title: 'EPS 구직자 명부탑재여부를 확인하세요',
    image: require('../assets/checklist/job-seeker-list.png'),
  },
  {
    id: '6',
    title: '고용 매칭 및 근로계약을 진행하세요',
    image: require('../assets/checklist/employment-contact.png'),
  },
  {
    id: '7',
    title: '사증 발급 인정서를 수령하세요',
    image: require('../assets/checklist/visa-issuance-certificate.png'),
    relatedLink: [
      {
        title: '사증발급인정서 수령',
        link: 'https://www.visa.go.kr/openPage.do?MENU_ID=10301'
      }
    ]
  },
  {
    id: '8',
    title: '비자를 신청하세요',
    image: require('../assets/checklist/e-9visa.png'),
    relatedLink: [
      {
        title: "사전예약 링크(하노이)",
        link: "https://www.visaforkorea-vt.com/?lang=vn",
        country: '베트남'
      },
      {
        title: "사전예약 링크(호치민)",
        link: "https://visaforkorea-hc.com/?lang=vn",
        country: '베트남'
      },
      {
        title: "사전예약 링크",
        link: "https://overseas.mofa.go.kr/th-th/brd/m_3135/list.do",
        country: '태국'
      }
    ]
  },
  {
    id: '9',
    title: '항공편을 예약하세요',
    image: require('../assets/checklist/airplane.png'),
    relatedLink: [
      {
        title: "항공편 예약",
        link: "https://www.vietjetair.com/",
        country: '베트남'
      },
      {
        title: "항공편 예약",
        link: "https://www.airasia.com/th",
        country: '태국'
      }
    ]
  },
  {
    id: '10',
    title: '관련서류를 잘 챙기고 출국하세요',
    image: require('../assets/checklist/fly-airplane.png'),
  },
  {
    id: '11',
    title: '한국 입국 15일 이내에 취업교육과 건강검진을 받으세요',
    checklist: {
      type: 'checkbox',
      items: [
        { text: '취업교육' },
        { text: '건강검진' },
      ],
    },
    image: require('../assets/checklist/korea-adaptive.png'),
    relatedLink: [
      {
        title: "취업교육 일정, 대상자 확인",
        link: "https://www.eps.go.kr/index.jsp"
      }
    ]
  },
  {
    id: '12',
    title: '사업장 배치 및 근로시작',
    image: require('../assets/checklist/job-start.png'),
  },
  {
    id: '13',
    title: '외국인 등록증 발급하기',
    image: require('../assets/checklist/residence-card.png'),
    relatedLink: [
      {
        title: "외국인 등록증 신청/예약 링크",
        link: "https://www.hikorea.go.kr/Main.pt",
      },
      {
        title: "제도 설명, 관련 서식 다운로드 링크",
        link: "https://www.immigration.go.kr/immigration/index.do"
      }
    ]
  },
];