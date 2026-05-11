export const USERS = [
  { id: 1, name: 'Alex Rivera', online: true, image: 'https://i.pravatar.cc/150?u=alex' },
  { id: 2, name: 'Sarah Chen', online: false, image: 'https://i.pravatar.cc/150?u=sarah' },
  { id: 3, name: 'David Miller', online: true, image: 'https://i.pravatar.cc/150?u=david' },
  { id: 4, name: 'Emma Wilson', online: false, image: 'https://i.pravatar.cc/150?u=emma' },
];

export const CHATS = [
  {
    id: 1,
    name: 'Alex Rivera',
    lastMessage: 'See you at the office tomorrow!',
    time: '10:42 AM',
    online: true,
    unread: 2,
    image: 'https://i.pravatar.cc/150?u=alex',
    messages: [
      { id: 1, text: 'Hey there! How is the project going?', time: '10:30 AM', sender: 'them' },
      { id: 2, text: 'Going great! Just finished the sidebar component.', time: '10:32 AM', sender: 'me' },
      { id: 3, text: 'Awesome! Did you use Tailwind v4?', time: '10:33 AM', sender: 'them' },
      { id: 4, text: 'Yes, it works really well with the new Vite plugin. The performance is incredible.', time: '10:35 AM', sender: 'me' },
      { id: 5, text: 'Cant wait to see it. Send me a screenshot when you can!', time: '10:36 AM', sender: 'them' },
    ]
  },
  {
    id: 2,
    name: 'Sarah Chen',
    lastMessage: 'Did you review the new design?',
    time: 'Yesterday',
    online: false,
    unread: 0,
    image: 'https://i.pravatar.cc/150?u=sarah',
    messages: [
      { id: 1, text: 'Hi Sarah, how are you?', time: '09:00 AM', sender: 'me' },
      { id: 2, text: 'I am doing well, just working on the Figma files.', time: '09:05 AM', sender: 'them' },
    ]
  }
];
