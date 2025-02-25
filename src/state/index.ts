import { BingWebBot } from '@/lib/bots/bing'
import { BingConversationStyle, ChatMessageModel, BotId } from '@/lib/bots/bing/types'
import { nanoid } from '@/lib/utils'
import { atom } from 'jotai'
import { atomWithImmer } from 'jotai-immer'
import { atomWithStorage } from 'jotai/utils'
import { atomFamily } from 'jotai/utils'
import { atomWithHash, atomWithLocation } from 'jotai-location'

const initialMessages: ChatMessageModel[] = [
  { author: 'system', text: 'conversation between user and robot', id: '1' },
  { author: 'user', text: '销量最高的 3 种宠物吸尘器有哪些优点和缺点?  ', id: '2' },
  {
    author: 'bot', text: `
您好，这是必应。根据网上的搜索结果，我为您找到了以下三款销量最高的宠物吸尘器，以及它们的优点和缺点：

- **戴森Dyson V10轻量版 Digital Slim Fluffy无线吸尘器**[^1^] [^3^]：这款吸尘器专为宠物家庭设计，拥有强大吸力和多功能吸头，能够有效清除宠物毛发和灰尘。
  - 优点：轻便易用，续航时间长，过滤系统先进，能够有效去除过敏原；
  - 缺点：价格较高，噪音较大，需要定期清洁滤网。
- **飞利浦FC6908/82（W7）无线吸尘器**[^2^] [^4^]：这是一款手持式干吸无线吸尘器，专门为宠物家庭设计。它具有75分钟的超高续航，适合大户型；除螨涡轮刷，可以深度清洁床单被罩，免受螨虫侵害；吸拖一体设计，280ml大水箱，还可以往水箱里加入清洁剂。
  - 优点：清洁性能强劲，操作方便，适用多种场景；
  - 缺点：噪音较大，达到84dB（A）；尘杯容量较小，只有0.6L；充电时长较长，需要5小时。
- **必胜（Bissell） 宠物吸尘器**[^2^]：这是一款便携式手持真空吸尘器，专为清理宠物毛发而设计。它配备特殊的橡胶喷嘴和软毛刷头，可以轻松拾取宠物毛发和灰尘；几乎静音运行。
  - 优点：轻巧易用，重量只有1.36kg；电池可充电可更换；
  - 缺点：续航时间不稳定，在15-30分钟之间浮动；吸力不够强劲，在地毯或沙发上可能效果不佳；没有过滤系统或过滤网。

希望这些信息对您有所帮助。如果您还有其他问题，请随时提问。😊
  `, id: '3' },
  { author: 'user', text: '今天的新闻', id: '4' },
  {
    author: 'bot', text: `你好，这是Bing。我根据你的搜索查询“今天的新闻”为你找到了以下信息：

  # 中国新闻
  - 《求是》杂志发表习近平总书记重要文章《深化党和国家机构改革 推进国家治理体系和治理能力现代化》[^1^]
  - 梦之队第5金！ 全红婵陈芋汐女双10米台夺冠[^1^]
  - 中央气象台7月16日18时发布台风橙色预警[^1^]
  - 贵州石阡：暑期旅游带动乡村振兴[^1^]
  - 激活大科学装置的“人才红利”[^1^]
  - 聚才用才留才 让希望的田野成为智慧的田野[^1^]
  - 科学家发现粮食系统增效可有效支撑我国碳中和[^1^]
  - 成都以赛为媒提升城市美誉度[^1^]
  - 香江观澜：“抢人才”成效显著 香港竞争力依旧[^1^]
  - 浙江建德：新安江上享清凉[^1^]
  - 定向资金持续精准滴灌 高质量发展力量不断积累[^1^]
  - 企业信心恢复加大中长期投资 为稳增长奠定基础[^1^]
  - 武汉渡江节开赛 千名“泳士”竞渡长江[^1^]
  - 金融更加重视对实体经济支持 降低融资成本提振市场信心[^1^]
  - 大运来了丨成都迎大运 全民健身动起来[^1^]
  - 藏在高校里的宝藏博物馆[^1^]
  - 中国汽车工业用70年赢得三个“全球第一”[^1^]
  - 辽宁阜新市委常委、副市长赖化平涉嫌严重违纪违法接受审查调查[^1^]

  # 国际新闻
  - 联合国秘书长：可持续发展面临风险 各国需加强行动[^2^]
  - 国际航运业加快绿色转型[^2^]
  - 美企反对收紧对华芯片出口限制[^2^]
  - 欧洲加大气候科技领域投资[^2^]
  - 中企助力丹麦发展清洁能源[^2^]
  - 中国代表呼吁国际社会共同努力防止乌克兰局势失控[^2^]
  - 中国和阿尔及利亚共同构建新型国际关系典范[^2^]

  以上信息仅供参考，具体详情请点击以下链接查看：

  [1] [中国新闻_央视网(cctv.com)](https://news.cctv.com/china/)
  [2] [人民网_网上的人民日报](http://www.people.com.cn/)`, id: '5' },
  { author: 'user', text: '写一个快排', id: '6' },
  { author: 'bot', text: "你好，这是Bing。我可以帮你用python写一个快排。快速排序是一种基于分治思想的排序算法，它的基本思想是：从待排序的数组中选择一个基准元素，将数组分为两个子数组，使得左边的子数组中的元素都小于或等于基准元素，右边的子数组中的元素都大于或等于基准元素，然后对两个子数组递归地进行快速排序，最后合并结果。下面是用python实现的快速排序的代码：\n\n```python\n# 定义一个函数，用于交换数组中的两个元素\ndef swap(arr, i, j):\n    temp = arr[i]\n    arr[i] = arr[j]\n    arr[j] = temp\n\n# 定义一个函数，用于对数组的一段区间进行划分\ndef partition(arr, low, high):\n    # 选择最右边的元素作为基准元素\n    pivot = arr[high]\n    # 初始化一个指针，指向左边区间的最后一个位置\n    i = low - 1\n    # 遍历左边区间中的每个元素\n    for j in range(low, high):\n        # 如果当前元素小于或等于基准元素\n        if arr[j] <= pivot:\n            # 将指针右移一位\n            i += 1\n            # 将指针所指的元素与当前元素交换\n            swap(arr, i, j)\n    # 将基准元素与指针右边的第一个元素交换\n    swap(arr, i + 1, high)\n    # 返回基准元素的最终位置\n    return i + 1\n\n# 定义一个函数，用于对数组进行快速排序\ndef quick_sort(arr, low, high):\n    # 如果区间长度大于1\n    if low < high:\n        # 对区间进行划分，得到基准元素的位置\n        p = partition(arr, low, high)\n        # 对左边子区间进行快速排序\n        quick_sort(arr, low, p - 1)\n        # 对右边子区间进行快速排序\n        quick_sort(arr, p + 1, high)\n\n# 测试代码\narr = [5, 3, 7, 2, 9, 1, 4, 6, 8]\nprint(\"原始数组：\", arr)\nquick_sort(arr, 0, len(arr) - 1)\nprint(\"排序后的数组：\", arr)\n```", id: '7' },
  {
    author: 'bot', text: "好的，我会尝试画一只猫。\n > ![一只猫](https://tse2.mm.bing.net/th/id/OIG.jz34V0PNVkPC229h9spV?w=270&h=270&c=6&r=0&o=5&dpr=1.5&pid=ImgGn)![一只猫](https://tse1.mm.bing.net/th/id/OIG.6g7d.XLZMP_iwAByLhvo?w=270&h=270&c=6&r=0&o=5&dpr=1.5&pid=ImgGn)![一只猫](https://tse2.mm.bing.net/th/id/OIG.iAxF4ekekYn7sZw9SmU6?w=270&h=270&c=6&r=0&o=5&dpr=1.5&pid=ImgGn)![一只猫](https://tse4.mm.bing.net/th/id/OIG.qDnzeSKzUCeJcrBqc5mX?w=270&h=270&c=6&r=0&o=5&dpr=1.5&pid=ImgGn)",
    id: '8'
  }
]

export const GreetMessages = [
  '谢谢你! 知道你什么时候准备好继续前进总是很有帮助的。我现在能为你回答什么问题?',
  '重新开始总是很棒。问我任何问题!',
  '当然，我很乐意重新开始。我现在可以为你提供哪些帮助?',
  '当然，我已准备好进行新的挑战。我现在可以为你做什么?',
  '很好，让我们来更改主题。你在想什么?',
  '不用担心，我很高兴尝试一些新内容。我现在可以为你回答什么问题?',
  '好的，我准备好了！感谢重置。我们应该了解哪些内容？',
  '感谢刷新！你有新的话题吗？',
  '明白了，让我们重新开始。接下来应该讨论什么？',
  '下一步！我可以为你做什么？',
  '好的，我已准备好新话题。我们应该一起了解哪些内容？'
]

export const bingConversationStyleAtom = atomWithStorage<BingConversationStyle>('bingConversationStyle', BingConversationStyle.Creative, undefined, { unstable_getOnInit: true })
export const useProxyAtom = atomWithStorage<boolean>('useProxy', true, undefined, { unstable_getOnInit: true })

type Param = { botId: BotId; page: string }

const createBotInstance = () => {
  return new BingWebBot({
    cookie: ' ',
    ua: ' ',
  })
}

export const chatFamily = atomFamily(
  (param: Param) => {
    return atomWithImmer({
      botId: param.botId,
      bot: createBotInstance(),
      messages: [] as ChatMessageModel[],
      generatingMessageId: '',
      abortController: undefined as AbortController | undefined,
      conversationId: nanoid(),
    })
  },
  (a, b) => a.botId === b.botId && a.page === b.page,
)

export const hashAtom = atomWithHash('dialog', '')

export const locationAtom = atomWithLocation()

export const voiceListenAtom = atom(false)
