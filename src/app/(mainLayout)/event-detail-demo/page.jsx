import EventDetailPage from '@/components/events/EventDetailPage';

// Sample event data
const sampleEventData = {
  uid: 'cmky16huw000lqnv4immcwxvu_cml0rhiz90003qnracehqid1e',
  eventUid: 'cmky16huw000lqnv4immcwxvu',
  variantUid: 'cml0rhiz90003qnracehqid1e',
  coverImage:
    'https://somewhrlightsail.s3.ap-south-1.amazonaws.com/Sdl/Event/1770115589419-download.jfif',
  coverImageAlt:
    'Padmabhushan Late Vaidya Shriramji Sharma Smarak Vyakhyan 2026',
  title:
    'Prayer Meeting – Remembering Late Vd. Shailesh Nadkarni, 09 January 2026, 2 pm to 5 pm',
  slug: 'prayer-meeting-–-remembering-late-vd.-shailesh-nadkarni,-09-january-2026,-2-pm-to-5-pm',
  tag: 'Shailesh Nadkarni, Prayer Meeting',
  shortDescription:
    'A prayer meeting organized to honor and remember the life, service, and contributions of Late Vaidya Shailesh Nadkarni within the Ayurvedic community.',
  description:
    '<div>The Prayer Meeting – Remembering Late Vd. Shailesh Nadkarni is a solemn gathering held on 09 January 2026 from 2 PM to 5 PM to pay tribute to the memory and legacy of Late Vaidya Shailesh Nadkarni. This event brings together practitioners, colleagues, students, and friends from the Ayurvedic fraternity to offer prayers, share reflections, and remember his valuable contributions to Ayurveda.</div><div><br></div><div>Late Vd. Shailesh Nadkarni was a respected figure in the Ayurvedic community known for his deep knowledge, compassionate practice, and dedication to traditional medicine. The prayer meeting serves as a moment of collective remembrance, gratitude, and respect for his life’s work and influence on many within the field. :contentReference[oaicite:0]{index=0}</div><div><br></div><div>Attendees are invited to participate in prayers and moments of reflection as part of honoring his legacy and contributions to health, healing, and education in Ayurveda.</div><div><br></div>',
  created_at: '2026-01-28T12:58:09.500Z',
  updated_at: '2026-01-30T10:50:06.415Z',
  eventCategory: {
    uid: 'cmky11zro000hqnv474gp54i1',
    name: 'Prayer Meeting',
    slug: 'prayer-meeting',
  },
  eventVariant: {
    uid: 'cml0rhiz90003qnracehqid1e',
    type: 'Offline',
    link: null,
    organizer: 'SDL India / Ayurvedic Community',
    startDate: '2026-01-28',
    endDate: '2026-01-28',
    startTime: '14:00',
    displayStartTime: '02:00 PM',
    endTime: '17:00',
    displayEndTime: '05:00 PM',
    addressLine1: 'Swaminarayan Chowk',
    addressLine2: null,
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    pincode: 400014,
    latitude: '19.0177255',
    longitude: '72.84436669999999',
    placeId: 'ChIJX36OE9zO5zsRfHu3n5loa5E',
    googleAddress:
      'Swaminarayan Chowk, Central Railway, opp. Dadar Railway Station, Dadar East, Dadar, Mumbai, Maharashtra 400014, India',
  },
  isUpcoming: false,
  isPast: true,
  previousEvent: {
    slug: 'test-test',
    id: '12345',
    title: 'Test Previous Event',
  },
  nextEvent: {
    slug: 'test-test',
    id: '12345',
    title: 'Test Next Event',
  },
};

export default function EventDetailDemoPage() {
  return <EventDetailPage eventData={sampleEventData} />;
}
