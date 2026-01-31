export const CHURCH_DATA = {
    name: "주성교회",
    engName: "Joosung Holiness Church",
    slogan: "세상을 비추는 거룩한 울림, 평안과 회복이 있는 신앙 공동체",
    images: {
        logo: "/logo_new.jpg",
        hero: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80",
        pastor: "https://images.unsplash.com/photo-1544717297-fa95b9ee9623?auto=format&fit=crop&q=80"
    },
    pastor: {
        name: "박주성 목사",
        imgUrl: "https://images.unsplash.com/photo-1544717297-fa95b9ee9623?auto=format&fit=crop&q=80",
        message: "주님의 평강이 여러분과 함께하시길 기도합니다."
    },
    contact: {
        address: "충북 청주시 흥덕구 봉명로219번길 24, 2층",
        phone: "010-8986-3965",
        email: "klum1223@gmail.com",
        blog: "https://blog.naver.com/joosung0416",
        youtube: "https://www.youtube.com/@주성성결교회",
        naverMap: "https://map.naver.com/p/search/충북%20청주시%20흥덕구%20봉명로219번길%2024"
    },
    worship: [
        { name: "주일예배", time: "오전 11:00" },
        { name: "성장이 있는 소모임(주일)", time: "오후 01:00" },
        { name: "수요 기도회", time: "오후 07:30" },
        { name: "아침 기도회", time: "오전 06:30 (월-금)" }
    ],
    ministries: [
        {
            id: "edu",
            name: "다음세대 교육사역",
            engName: "Next Generation",
            desc: "꿈과 희망으로 자라나는 아이들을 위한 영적 성장을 돕습니다.",
            detail: "유치부, 초등부, 청소년부가 각 연령에 맞는 예배와 분반 공부를 통해 하나님의 말씀을 배우고, 비전을 품는 기독교 교육을 실천합니다.",
            img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80"
        },
        {
            id: "worship",
            name: "예배 및 찬양사역",
            engName: "Worship & Arts",
            desc: "영과 진리로 드리는 예배를 통해 하나님의 임재를 경험합니다.",
            detail: "성가대와 찬양팀이 매 주일 예배의 찬양을 맡아 성도들의 영적 은혜를 돕고, 절기별 음악 예배를 기획하여 풍성한 예배 문화를 만들어갑니다.",
            img: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80"
        },
        {
            id: "mission",
            name: "선교 및 구제사역",
            engName: "Mission & Outreach",
            desc: "세상의 아픔을 돌보고 복음의 증인이 되는 삶을 실천합니다.",
            detail: "지역 사회의 소외된 이웃을 돕는 구제 활동과 해외 선교사 후원을 통해 땅 끝까지 복음을 전하라는 주님의 지상 명령을 수행합니다.",
            img: "https://images.unsplash.com/photo-1469571483357-598e0445eba7?auto=format&fit=crop&q=80"
        }
    ]
};

export const checkIfAdmin = (user: any) => {
    if (!user || !user.email) return false;
    return user.email.toLowerCase() === CHURCH_DATA.contact.email.toLowerCase();
};
