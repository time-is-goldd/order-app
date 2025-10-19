// 상수 정의
export const PRODUCTS = [
  {
    id: 'americano-ice',
    name: '아메리카노(ICE)',
    price: 4000,
    description: '깔끔하고 시원한 아이스 아메리카노',
    image: '🧊☕'
  },
  {
    id: 'americano-hot',
    name: '아메리카노(HOT)',
    price: 4000,
    description: '따뜻하고 진한 핫 아메리카노',
    image: '☕'
  },
  {
    id: 'cafe-latte',
    name: '카페라떼',
    price: 5000,
    description: '부드러운 우유와 에스프레소의 조화',
    image: '🥛☕'
  },
  {
    id: 'cappuccino',
    name: '카푸치노',
    price: 5000,
    description: '진한 에스프레소와 벨벳같은 우유 거품',
    image: '☕💨'
  },
  {
    id: 'mocha',
    name: '모카',
    price: 5500,
    description: '달콤한 초콜릿과 커피의 만남',
    image: '🍫☕'
  },
  {
    id: 'vanilla-latte',
    name: '바닐라 라떼',
    price: 5500,
    description: '달콤한 바닐라 시럽이 들어간 라떼',
    image: '🌿☕'
  }
]

export const ORDER_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  COMPLETED: 'completed'
}

export const INVENTORY_STATUS = {
  NORMAL: '정상',
  LOW: '주의',
  OUT_OF_STOCK: '품절'
}

export const OPTIONS = {
  SHOT: { key: 'shot', name: '샷 추가', price: 500 },
  SYRUP: { key: 'syrup', name: '시럽 추가', price: 0 }
}
