import { CHURCH_DATA as ORIGINAL_DATA } from './constants';

export interface Scripture {
    text: string;
    source: string;
    category: string;
}

export const SCRIPTURES: Scripture[] = [
    { text: "두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라 내가 너를 굳세게 하리라 참으로 너를 도와 주리라 참으로 나의 의로운 오른손으로 너를 붙들리라", source: "이사야 41:10", category: "strength" },
    { text: "여호와는 나의 목자시니 내게 부족함이 없으리로다 그가 나를 푸른 풀밭에 누이시며 쉴 만한 물 가로 인도하시는도다", source: "시편 23:1-2", category: "comfort" },
    { text: "너희는 마음에 근심하지 말라 하나님을 믿으니 또 나를 믿으라", source: "요한복음 14:1", category: "comfort" },
    { text: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라", source: "빌립보서 4:13", category: "strength" },
    { text: "아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라 그리하면 모든 지각에 뛰어난 하나님의 평강이 그리스도 예수 안에서 너희 마음과 생각을 지키시리라", source: "빌립보서 4:6-7", category: "comfort" },
    { text: "우리가 알거니와 하나님을 사랑하는 자 곧 그의 뜻대로 부르심을 입은 자들에게는 모든 것이 합력하여 선을 이루느니라", source: "로마서 8:28", category: "hope" },
    { text: "너의 행사를 여호와께 맡기라 그리하면 네가 경영하는 것이 이루어지리라", source: "잠언 16:3", category: "wisdom" },
    { text: "사람이 마음으로 자기의 길을 계획할지라도 그의 걸음을 인도하시는 이는 여호와시니라", source: "잠언 16:9", category: "wisdom" },
    { text: "사랑은 오래 참고 사랑은 온유하며 시기하지 아니하며 사랑은 자랑하지 아니하며 교만하지 아니하며", source: "고린도전서 13:4", category: "love" },
    { text: "수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라", source: "마태복음 11:28", category: "comfort" },
    { text: "너희 중에 누구든지 지혜가 부족하거든 모든 사람에게 후히 주시고 꾸짖지 아니하시는 하나님께 구하라 그리하면 주시리라", source: "야고보서 1:5", category: "wisdom" },
    { text: "여호와의 인자와 긍휼이 무궁하시므로 우리가 진멸되지 아니함이니이다 이것들이 아침마다 새로우니 주의 성실하심이 크시도소이다", source: "예레미야 애가 3:22-23", category: "hope" },
    { text: "오직 여호와를 앙망하는 자는 새 힘을 얻으리니 독수리가 날개치며 올라감 같을 것이요 달음박질하여도 곤비하지 아니하겠고 걸어가도 피곤하지 아니하리로다", source: "이사야 40:31", category: "strength" },
    { text: "내가 네게 명령한 것이 아니냐 강하고 담대하라 두려워하지 말며 놀라지 말라 네가 어디로 가든지 네 하나님 여호와가 너와 함께 하느니라 하시니라", source: "여호수아 1:9", category: "strength" },
    { text: "주라 그리하면 너희에게 줄 것이니 곧 후히 되어 누르고 흔들어 넘치도록 하여 너희에게 안겨 주리라", source: "누가복음 6:38", category: "wisdom" },
    { text: "네 짐을 여호와께 맡기라 그가 너를 붙드시고 의인의 요동함을 영원히 허락하지 아니하시리로다", source: "시편 55:22", category: "comfort" },
    { text: "볼지어다 내가 문 밖에 서서 두드리노니 누구든지 내 음성을 듣고 문을 열면 내가 그에게로 들어가 그와 더불어 먹고 그는 나와 더불어 먹으리라", source: "요한계시록 3:20", category: "love" },
    { text: "너희가 내 안에 거하고 내 말이 너희 안에 거하면 무엇이든지 원하는 대로 구하라 그리하면 이루리라", source: "요한복음 15:7", category: "hope" },
    { text: "내가 평안히 눕고 자기도 하리니 나를 안전히 살게 하시는 이는 오직 여호와이시니이다", source: "시편 4:8", category: "comfort" },
    { text: "여호와를 경외하는 것이 지혜의 근본이요 거룩하신 자를 아는 것이 명철이니라", source: "잠언 9:10", category: "wisdom" },
    { text: "너희는 세상의 빛이라 산 위에 있는 동네가 숨겨지지 못할 것이요", source: "마태복음 5:14", category: "hope" },
    { text: "우리가 사랑함은 그가 먼저 우리를 사랑하셨음이라", source: "요한일서 4:19", category: "love" },
    { text: "나의 하나님이 그리스도 예수 안에서 영광 가운데 그 풍성한 대로 너희 모든 쓸 것을 채우시리라", source: "빌립보서 4:19", category: "hope" },
    { text: "주의 말씀은 내 발에 등이요 내 길에 빛이니이다", source: "시편 119:105", category: "wisdom" },
    { text: "너는 내일 일을 자랑하지 말라 하루 동안에 무슨 일이 일어날는지 네가 알 수 없음이니라", source: "잠언 27:1", category: "wisdom" },
    { text: "새 계명을 너희에게 주노니 서로 사랑하라 내가 너희를 사랑한 것 같이 너희도 서로 사랑하라", source: "요한복음 13:34", category: "love" },
    { text: "평안을 너희에게 끼치노니 곧 나의 평안을 너희에게 주노라 내가 너희에게 주는 것은 세상이 주는 것과 같지 아니하니라 너희는 마음에 근심하지도 말고 두려워하지도 말라", source: "요한복음 14:27", category: "comfort" },
    { text: "믿음은 바라는 것들의 실상이요 보이지 않는 것들의 증거니", source: "히브리서 11:1", category: "hope" },
    { text: "모든 지킬 만한 것 중에 더욱 네 마음을 지키라 생명의 근원이 이에서 남이니라", source: "잠언 4:23", category: "wisdom" },
    { text: "너희가 전에는 어둠이더니 이제는 주 안에서 빛이라 빛의 자녀들처럼 행하라", source: "에베소서 5:8", category: "hope" }
];
