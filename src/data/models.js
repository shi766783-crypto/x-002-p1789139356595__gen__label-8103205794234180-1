const svgToBase64 = (svg) => `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`

const cover = (kind, title, accent) => {
  const graphics = {
    fan: `
      <circle cx="154" cy="120" r="56" fill="#1b2428" stroke="${accent}" stroke-width="5"/>
      <circle cx="154" cy="120" r="11" fill="${accent}"/>
      <path d="M154 109 C126 75 112 91 125 112 C136 130 149 131 154 109Z" fill="#e6f0ed" opacity=".9"/>
      <path d="M163 120 C197 92 191 120 176 131 C162 141 157 134 163 120Z" fill="#e6f0ed" opacity=".9"/>
      <path d="M154 131 C182 163 153 161 139 149 C125 137 134 129 154 131Z" fill="#e6f0ed" opacity=".9"/>
      <path d="M148 120 C113 148 112 121 128 109 C141 99 149 105 148 120Z" fill="#e6f0ed" opacity=".9"/>
      <path d="M154 176 L154 245 M120 247 H188" stroke="${accent}" stroke-width="7" stroke-linecap="round"/>
      <path d="M123 183 C102 181 91 192 89 205 H219 C216 191 205 181 185 183" fill="none" stroke="#8e9a99" stroke-width="4"/>
    `,
    bike: `
      <circle cx="92" cy="192" r="43" fill="none" stroke="${accent}" stroke-width="6"/>
      <circle cx="224" cy="192" r="43" fill="none" stroke="${accent}" stroke-width="6"/>
      <path d="M92 192 L135 126 L181 192 Z M135 126 L173 126 L224 192 M135 126 L158 192 M158 192 L181 192" fill="none" stroke="#e6f0ed" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M135 126 L122 104 M118 104 H143 M173 126 L190 104 M183 104 H197" stroke="${accent}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="158" cy="192" r="12" fill="#1b2428" stroke="${accent}" stroke-width="4"/>
    `,
    engine: `
      <rect x="86" y="88" width="139" height="118" rx="14" fill="#273238" stroke="${accent}" stroke-width="5"/>
      <path d="M105 88 V64 H139 V88 M151 88 V64 H185 V88 M197 88 V64 H221 V88" stroke="#e6f0ed" stroke-width="5"/>
      <path d="M107 120 H204 M107 152 H204 M107 184 H204" stroke="${accent}" stroke-width="8" stroke-linecap="round"/>
      <circle cx="119" cy="226" r="20" fill="none" stroke="#e6f0ed" stroke-width="5"/>
      <circle cx="202" cy="226" r="20" fill="none" stroke="#e6f0ed" stroke-width="5"/>
      <path d="M126 120 C155 102 176 136 207 119" fill="none" stroke="#f3b45f" stroke-width="4"/>
    `,
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="270" viewBox="0 0 320 270">
    <rect width="320" height="270" fill="#101719"/>
    <path d="M0 229 H320" stroke="#29383b" />
    <g>${graphics[kind]}</g>
    <text x="24" y="38" fill="#f2f5f2" font-family="Arial, sans-serif" font-size="16" letter-spacing="2">${title}</text>
  </svg>`
  return svgToBase64(svg)
}

const part = (id, name, code, description, material, faults, position, size, parentId, children, color, offset) => ({
  id,
  name,
  code,
  description,
  material,
  faults,
  position,
  size,
  parentId,
  children,
  color,
  offset,
})

export const presetModels = [
  {
    id: 'desk-fan',
    name: '立式循环电风扇',
    shortName: '循环电扇',
    category: '家用电器',
    visual: 'fan',
    accent: '#f3b45f',
    cover: cover('fan', 'AIR CIRCULATOR / 01', '#f3b45f'),
    description: '通过电机驱动扇叶旋转，将机械能转化为定向气流。防护网、叶片、转轴与底座共同完成安全稳定的送风。',
    principle: '交流电进入电机后产生旋转磁场，转子带动叶片持续旋转，叶片的翼型将空气沿轴向加速，形成低噪循环风。',
    stats: { complexity: '中等', parts: 7, views: 824 },
    connections: [
      '电机通过转轴与扇叶刚性连接，转速直接决定风量。',
      '前后网罩通过卡扣固定在机头外框，负责安全隔离与导流。',
      '机头与支撑杆通过俯仰关节连接，可调整送风角度。',
    ],
    parts: [
      part('fan-guard', '前防护网', 'A-01', '隔离高速旋转的叶片，同时让气流顺畅通过。网格间距兼顾安全性与风阻。', '喷粉钢丝 + ABS 外框', '网罩变形、卡扣松脱、积尘导致风阻增大', { left: 24, top: 18 }, { width: 52, height: 48 }, null, ['fan-blade'], '#f3b45f', { x: -16, y: -10 }),
      part('fan-blade', '五叶扇叶', 'A-02', '通过翼型截面把旋转运动转化为轴向气流，是整台设备的核心做功部件。', 'PC 透明塑料', '叶片断裂、偏心抖动、轴套磨损', { left: 31, top: 27 }, { width: 37, height: 34 }, 'fan-guard', ['fan-motor'], '#a8d7c6', { x: -4, y: 4 }),
      part('fan-motor', '无刷电机', 'A-03', '将电能转换为稳定的旋转动力，并通过控制板实现多档转速。', '铝合金壳体 + 漆包铜线', '电机异响、线圈过热、启动失败', { left: 43, top: 39 }, { width: 17, height: 17 }, 'fan-blade', ['fan-shaft'], '#e77961', { x: 11, y: 18 }),
      part('fan-shaft', '传动轴', 'A-04', '连接电机转子与扇叶中心，负责传递扭矩并保持旋转同心度。', '不锈钢', '弯曲、锈蚀、轴套间隙过大', { left: 48, top: 28 }, { width: 5, height: 34 }, 'fan-motor', [], '#f3b45f', { x: 19, y: 8 }),
      part('fan-head', '机头外框', 'A-05', '承载网罩、电机与俯仰结构，提供前端总成的刚性骨架。', 'ABS 工程塑料', '裂纹、卡扣断裂、俯仰松垮', { left: 17, top: 11 }, { width: 66, height: 63 }, null, ['fan-guard', 'fan-motor'], '#8ab8b0', { x: -9, y: -2 }),
      part('fan-pole', '伸缩支撑杆', 'A-06', '将机头高度传递到底座，同时可通过伸缩调节送风高度。', '钢管 + 喷涂层', '高度锁定失效、杆体晃动、锈蚀', { left: 46, top: 63 }, { width: 9, height: 22 }, null, ['fan-base'], '#9baaa5', { x: -6, y: 25 }),
      part('fan-base', '稳定底座', 'A-07', '通过较大的支撑面和配重抵抗机头旋转产生的反作用力。', 'ABS 外壳 + 铸铁配重', '底座开裂、脚垫脱落、重心不稳', { left: 31, top: 82 }, { width: 39, height: 12 }, 'fan-pole', [], '#d8a165', { x: 7, y: 38 }),
    ],
  },
  {
    id: 'city-bike',
    name: '城市通勤自行车',
    shortName: '城市自行车',
    category: '交通工具',
    visual: 'bike',
    accent: '#78b8ae',
    cover: cover('bike', 'CITY COMMUTER / 02', '#78b8ae'),
    description: '以三角车架为骨架，通过脚踏、链条和飞轮传递人力，配合转向系统与制动系统完成城市骑行。',
    principle: '脚踏带动牙盘，牙盘通过链条把扭矩传递到后轮飞轮，后轮获得驱动力；车把改变前叉方向完成转向。',
    stats: { complexity: '中等', parts: 8, views: 613 },
    connections: [
      '车架五通安装中轴与牙盘，链条绕过后下叉连接后轮飞轮。',
      '前叉通过碗组与车架头管转动连接，车把控制方向。',
      '刹车把通过钢索拉动夹器，使刹车片夹紧轮圈。',
    ],
    parts: [
      part('bike-frame', '菱形车架', 'B-01', '自行车的主承力骨架，将骑手重量、路面冲击与动力传递到两个车轮。', '铝合金管材', '焊缝裂纹、掉漆锈蚀、车架变形', { left: 22, top: 26 }, { width: 59, height: 48 }, null, ['bike-crank', 'bike-fork'], '#78b8ae', { x: -12, y: 6 }),
      part('bike-wheel-front', '前轮组', 'B-02', '由轮圈、辐条、花鼓和外胎组成，负责支撑、滚动与方向跟随。', '铝合金 + 橡胶', '胎压不足、辐条松动、轮圈偏摆', { left: 66, top: 51 }, { width: 30, height: 30 }, null, ['bike-fork'], '#f3b45f', { x: 14, y: -5 }),
      part('bike-wheel-rear', '后轮组', 'B-03', '承受主要驱动力，通过飞轮接收链条传来的扭矩。', '铝合金 + 橡胶', '链条跳齿、辐条松动、花鼓异响', { left: 6, top: 51 }, { width: 30, height: 30 }, null, ['bike-chain'], '#f3b45f', { x: -12, y: -4 }),
      part('bike-fork', '前叉与车把', 'B-04', '前叉连接前轮与车架，车把和把立把骑手的转向动作传递给前轮。', '铝合金 + 橡胶握把', '碗组松动、前叉弯曲、把立滑移', { left: 67, top: 21 }, { width: 17, height: 48 }, 'bike-frame', [], '#e77961', { x: 18, y: -10 }),
      part('bike-crank', '中轴与牙盘', 'B-05', '将脚踏的往复踩踏转为连续旋转，并作为前端链传动的主动轮。', '锻造钢 + 铝合金', '中轴异响、牙盘变形、曲柄松动', { left: 43, top: 55 }, { width: 18, height: 18 }, 'bike-frame', ['bike-chain'], '#e77961', { x: 1, y: 15 }),
      part('bike-chain', '链条与飞轮', 'B-06', '以滚子链条传递牙盘与后轮飞轮之间的旋转运动，提供不同的传动比。', '镀镍合金钢', '缺油异响、链条拉长、跳链', { left: 17, top: 47 }, { width: 48, height: 33 }, 'bike-crank', [], '#d8a165', { x: -3, y: 18 }),
      part('bike-seat', '座椅组件', 'B-07', '为骑手提供稳定支撑，并通过座杆高度调整骑行姿势与腿部发力角度。', '发泡海绵 + 合金', '座杆下滑、坐垫松动、表皮破损', { left: 37, top: 12 }, { width: 22, height: 19 }, 'bike-frame', [], '#9baaa5', { x: -2, y: -17 }),
      part('bike-brake', '夹器制动', 'B-08', '刹车把拉动钢索，使刹车片与轮圈摩擦，将动能转化为热能。', '铝合金 + 橡胶', '刹车片磨损、钢索生锈、制动力不足', { left: 76, top: 52 }, { width: 14, height: 15 }, 'bike-fork', [], '#f3b45f', { x: 26, y: 8 }),
    ],
  },
  {
    id: 'engine-four-cylinder',
    name: '四缸汽油发动机',
    shortName: '四缸发动机',
    category: '机械工具',
    visual: 'engine',
    accent: '#e77961',
    cover: cover('engine', 'INLINE-4 ENGINE / 03', '#e77961'),
    description: '通过进气、压缩、做功、排气四个冲程，在多个气缸内循环燃烧，将化学能转化为曲轴旋转动力。',
    principle: '空气与燃油在气缸内混合并被火花塞点燃，燃烧膨胀推动活塞下行，再由连杆带动曲轴旋转输出动力。',
    stats: { complexity: '高等', parts: 8, views: 978 },
    connections: [
      '气门机构控制混合气进入与废气排出，确保四冲程时序正确。',
      '活塞通过连杆与曲轴连接，把直线往复运动转为旋转运动。',
      '润滑油道贯穿缸体、曲轴和凸轮轴，降低高速运动部件的摩擦。',
    ],
    parts: [
      part('engine-block', '气缸体', 'C-01', '发动机的基础承力件，内部布置气缸孔、油道与水道，承载主要运动组件。', '铸铁 / 铝合金', '缸体裂纹、冷却水道堵塞、密封面变形', { left: 20, top: 27 }, { width: 63, height: 49 }, null, ['engine-piston', 'engine-crank'], '#e77961', { x: -12, y: 9 }),
      part('engine-head', '气缸盖', 'C-02', '封闭气缸上部并集成进排气道、气门与火花塞，决定燃烧室形状。', '铝合金', '缸垫冲坏、气门积碳、平面变形', { left: 19, top: 15 }, { width: 66, height: 28 }, null, ['engine-valve'], '#f3b45f', { x: -8, y: -11 }),
      part('engine-piston', '活塞组', 'C-03', '在气缸内往复运动，承受燃烧压力并把力传给连杆，活塞环负责密封。', '铝合金 + 合金钢活塞销', '活塞环磨损、敲缸、烧蚀', { left: 28, top: 35 }, { width: 47, height: 24 }, 'engine-block', ['engine-rod'], '#a8d7c6', { x: -10, y: 15 }),
      part('engine-rod', '连杆', 'C-04', '连接活塞与曲轴，承受交变拉压载荷，把活塞的直线运动传递给曲轴。', '锻钢', '小头间隙过大、弯曲、轴瓦磨损', { left: 42, top: 49 }, { width: 18, height: 29 }, 'engine-piston', ['engine-crank'], '#9baaa5', { x: 13, y: 24 }),
      part('engine-crank', '曲轴', 'C-05', '将各缸的往复运动合成为连续旋转，并通过飞轮向变速箱输出动力。', '锻钢', '轴颈磨损、动平衡异常、油封漏油', { left: 26, top: 69 }, { width: 55, height: 17 }, 'engine-block', [], '#e77961', { x: 4, y: 31 }),
      part('engine-valve', '配气机构', 'C-06', '按照发动机工作时序开启和关闭进排气门，控制气体交换。', '合金钢 + 铝合金', '正时错位、气门烧蚀、凸轮磨损', { left: 39, top: 19 }, { width: 32, height: 18 }, 'engine-head', [], '#78b8ae', { x: 15, y: -10 }),
      part('engine-spark', '火花塞', 'C-07', '在压缩冲程末端产生高压电火花，点燃气缸内的混合气。', '陶瓷绝缘体 + 镍合金', '电极积碳、点火失效、螺纹损伤', { left: 56, top: 8 }, { width: 8, height: 23 }, 'engine-head', [], '#f3b45f', { x: 21, y: -20 }),
      part('engine-flywheel', '飞轮', 'C-08', '储存曲轴旋转惯量，平滑各缸做功间隔的速度波动，并连接离合器。', '铸铁', '齿圈磨损、变形、固定螺栓松动', { left: 72, top: 65 }, { width: 17, height: 24 }, 'engine-crank', [], '#d8a165', { x: 27, y: 26 }),
    ],
  },
]

export function getPart(model, partId) {
  return model?.parts.find((part) => part.id === partId) || model?.parts[0]
}

export function getDeviceById(models, id) {
  return models.find((model) => model.id === id)
}

export function createCustomDevice({ name, category, description, coverImage, parts }) {
  return {
    id: `custom-${Date.now()}`,
    name,
    shortName: name,
    category,
    visual: 'custom',
    accent: '#f3b45f',
    cover: coverImage,
    description,
    principle: '这是用户自定义的结构模型。通过逐个标记区域，可以建立自己的部件说明与装配关系。',
    stats: { complexity: parts.length > 5 ? '中等' : '入门', parts: parts.length, views: 0 },
    connections: ['部件连接关系由创建者在标记区域时建立，可在结构详情中继续补充。'],
    parts: parts.map((item, index) => ({
      ...item,
      id: item.id || `custom-part-${Date.now()}-${index}`,
      code: `U-${String(index + 1).padStart(2, '0')}`,
      parentId: null,
      children: [],
      color: ['#f3b45f', '#78b8ae', '#e77961', '#a8d7c6'][index % 4],
      offset: { x: (index % 3 - 1) * 12, y: (index % 2 ? 8 : -8) },
    })),
  }
}
