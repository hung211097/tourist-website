export const mapOption = {
    styles: [
        {
            "featureType": "poi",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        }
    ],
    minZoom: 6,
    maxZoom: 20
};

/* {
  zoomLevel: Distance (km)
} */
export const mapDistance = {
  "6": 600,
  "7": 400,
  "8": 200,
  "9": 120,
  "10": 80,
  "11": 50,
  "12": 30,
  "13": 10,
  "14": 4,
  "15": 2,
  "16": 1.5,
  "17": 0.7,
  "18": 0.3,
  "19": 0.2,
  "20": 0.1
}

export const filter = [
  {label: 'Airport', value: 'airport', isCheck: false},
  {label: 'Amusement', value: 'amusement', isCheck: false},
  {label: 'Bank', value: 'bank', isCheck: false},
  {label: 'Bus stop', value: 'bus_stop', isCheck: false},
  {label: 'Cafe & Milk tea', value: 'cafe_and_milk_tea', isCheck: false},
  {label: 'Church', value: 'church', isCheck: false},
  {label: 'Gas Station', value: 'gas_station', isCheck: false},
  {label: 'Hospital', value: 'hospital', isCheck: false},
  {label: 'Hotel', value: 'hotel', isCheck: false},
  {label: 'Mall', value: 'mall', isCheck: false},
  {label: 'Market', value: 'market', isCheck: false},
  {label: 'Night Market', value: 'marketnight', isCheck: false},
  {label: 'Museum', value: 'museum', isCheck: false},
  {label: 'Park', value: 'park', isCheck: false},
  {label: 'Police', value: 'police', isCheck: false},
  {label: 'Restaurant', value: 'restaurant', isCheck: false},
  {label: 'Sport', value: 'sport', isCheck: false},
  {label: 'Travel Agency', value: 'start_end', isCheck: false},
  {label: 'Temple', value: 'temple', isCheck: false},
  {label: 'Tourist Area', value: 'tourist_area', isCheck: false},
]

export const companyPosition = {
  lat: 10.772150,
  lng: 106.674838
}

export const transports = {
  ROADWAY: 'roadway',
  WATERWAY: 'waterway',
  AIRWAY: 'airway',
  RAILWAY: 'railway'
}
