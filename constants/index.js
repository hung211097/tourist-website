const env = process.env.NODE_ENV
const NEWS = 2

export const wizardStep = {
  PASSENGER: 'passengers',
  PAYMENT: 'payment',
  CONFIRMATION: 'confirmation'
}

export const modal = {
  EXPIRED: 'EXPIRED',
  LOADING: 'LOADING',
  CANCEL: 'CANCEL'
}

export const lng = {
  EN: 'en',
  VI: 'vi'
}

export const mainCategoriesList = [NEWS]

export function getDosmesticTour(){
  if(env === 'development'){
    return [
      {name: "Miền Bắc", locations:
        [
          {id: 1, name: "Hà Nội", slug: "tour-ha-noi"},
          {id: 2, name: "Hà Giang", slug: "tour-ha-giang"},
          {id: 4, name: "Cao Bằng", slug: "tour-cao-bang"},
          {id: 38, name: "Thanh Hóa", slug: "tour-thanh-hoa"},
          {id: 25, name: "Phú Thọ", slug: "tour-phu-tho"},
        ]
      },
      {name: "Miền Trung", locations:
        [
          {id: 46, name: "Thừa Thiên Huế", slug: "tour-thua-thien-hue"},
          {id: 56, name: "Khánh Hòa", slug: "tour-khanh-hoa"},
          {id: 60, name: "Bình Thuận", slug: "tour-binh-thuan"},
          {id: 68, name: "Lâm Đồng", slug: "tour-lam-dong"},
          {id: 48, name: "Đà Nẵng", slug: "tour-da-nang"},
        ]
      },
      {name: "Miền Nam", locations:
        [
          {id: 86, name: "Vĩnh Long", slug: "tour-vinh-long"},
          {id: 89, name: "An Giang", slug: "tour-an-giang"},
          {id: 91, name: "Kiên Giang", slug: "tour-kien-giang"},
          {id: 96, name: "Cà Mau", slug: "tour-ca-mau"},
          {id: 87, name: "Đồng Tháp", slug: "tour-dong-thap"},
        ]
      }
    ]
  }
  return [
    {name: "Miền Bắc", locations:
      [
        {id: 1, name: "Hà Nội", slug: "tour-ha-noi"},
        {id: 2, name: "Hà Giang", slug: "tour-ha-giang"},
        {id: 4, name: "Cao Bằng", slug: "tour-cao-bang"},
        {id: 38, name: "Thanh Hóa", slug: "tour-thanh-hoa"},
        {id: 25, name: "Phú Thọ", slug: "tour-phu-tho"},
      ]
    },
    {name: "Miền Trung", locations:
      [
        {id: 46, name: "Thừa Thiên Huế", slug: "tour-thua-thien-hue"},
        {id: 56, name: "Khánh Hòa", slug: "tour-khanh-hoa"},
        {id: 60, name: "Bình Thuận", slug: "tour-binh-thuan"},
        {id: 68, name: "Lâm Đồng", slug: "tour-lam-dong"},
        {id: 48, name: "Đà Nẵng", slug: "tour-da-nang"},
      ]
    },
    {name: "Miền Nam", locations:
      [
        {id: 86, name: "Vĩnh Long", slug: "tour-vinh-long"},
        {id: 89, name: "An Giang", slug: "tour-an-giang"},
        {id: 91, name: "Kiên Giang", slug: "tour-kien-giang"},
        {id: 96, name: "Cà Mau", slug: "tour-ca-mau"},
        {id: 87, name: "Đồng Tháp", slug: "tour-dong-thap"},
      ]
    }
  ]
}

export function getInternationalTour(){
  if(env === 'development'){
    return [
      {name: "Châu Á", locations:
        [
          {id: 1, name: "Campuchia", slug: "tour-campuchia"},
          {id: 19, name: "Đài Loan", slug: "tour-dai-loan"},
          {id: 3, name: "Hàn Quốc", slug: "tour-han-quoc"},
          {id: 4, name: "Singapore", slug: "tour-singapore"},
          {id: 5, name: "Nhật Bản", slug: "tour-nhat-ban"},
          {id: 6, name: "Thái Lan", slug: "tour-thai-lan"},
          {id: 7, name: "Trung Quốc", slug: "tour-trung-quoc"},
        ]
      },
      {name: "Châu Âu", locations:
        [
          {id: 8, name: "Anh", slug: "tour-anh"},
          {id: 9, name: "Nga", slug: "tour-nga"},
          {id: 10, name: "Scotland", slug: "tour-scotland"},
          {id: 11, name: "Pháp", slug: "tour-phap"},
          {id: 12, name: "Ý", slug: "tour-y"},
          {id: 13, name: "Đức", slug: "tour-duc"},
          {id: 2, name: "Thổ Nhĩ Kỳ", slug: "tour-tho-nhi-ky"},
        ]
      },
      {name: "Khác", locations:
        [
          {id: 14, name: "Canada", slug: "tour-canada"},
          {id: 15, name: "Úc", slug: "tour-uc"},
          {id: 16, name: "Mỹ", slug: "tour-my"},
          {id: 17, name: "Cuba", slug: "tour-cuba"},
          {id: 18, name: "Nam Phi", slug: "tour-nam-phi"},
        ]
      }
    ]
  }
  return [
    {name: "Châu Á", locations:
      [
        {id: 1, name: "Campuchia", slug: "tour-campuchia"},
        {id: 2, name: "Đài Loan", slug: "tour-dai-loan"},
        {id: 3, name: "Hàn Quốc", slug: "tour-han-quoc"},
        {id: 4, name: "Singapore", slug: "tour-singapore"},
        {id: 5, name: "Nhật Bản", slug: "tour-nhat-ban"},
        {id: 6, name: "Thái Lan", slug: "tour-thai-lan"},
        {id: 7, name: "Trung Quốc", slug: "tour-trung-quoc"},
      ]
    },
    {name: "Châu Âu", locations:
      [
        {id: 8, name: "Anh", slug: "tour-anh"},
        {id: 9, name: "Nga", slug: "tour-nga"},
        {id: 10, name: "Scotland", slug: "tour-scotland"},
        {id: 11, name: "Pháp", slug: "tour-phap"},
        {id: 12, name: "Ý", slug: "tour-y"},
        {id: 13, name: "Đức", slug: "tour-duc"},
        {id: 2, name: "Thổ Nhĩ Kỳ", slug: "tour-tho-nhi-ky"},
      ]
    },
    {name: "Khác", locations:
      [
        {id: 14, name: "Canada", slug: "tour-canada"},
        {id: 15, name: "Úc", slug: "tour-uc"},
        {id: 16, name: "Mỹ", slug: "tour-my"},
        {id: 17, name: "Cuba", slug: "tour-cuba"},
        {id: 18, name: "Nam Phi", slug: "tour-nam-phi"},
      ]
    }
  ]
}
