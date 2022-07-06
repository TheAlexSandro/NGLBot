const tanya = [
  ['FILE_ID', '9876', '0734', '7653', '9812', '1034', '7643'], // 1
  ['FILE_ID', '6432', '4781', '8943', '4401', '3298', '0909'] // 2
  ['FILE_ID', '7623', '6374', '0000', '1467', '6503', '7436'], // 3
  ['FILE_ID', '9876', '7801', '1382', '4401', '7436', '9812'], // 4
  ['FILE_ID', '7938', '8943', '4401', '1562', '2341', '0909'], // 5
  ['FILE_ID', '6712', '9999', '0101', '6198', '1562', '6503'], // 6
  ['FILE_ID', '6712', '5479', '0923', '7781', '1001', '5391'], // 7
  ['FILE_ID', '1234', '4121', '6731', '1111', '9321', '4712'], // 8
  ['FILE_ID', '4121', '0101', '4762', '0931', '7781', '9321'], // 9
  ['FILE_ID', '6531', '5479', '8943', '4401', '7643', '0909'], // 10
  ['FILE_ID', '9999', '9957', '0000', '1001', '9812', '4712'], // 11
  ['FILE_ID', '0000', '9999', '0101', '6198', '7130', '7109'], // 12
  ['FILE_ID', '8943', '1562', '7781', '6198', '0931', '6484'], // 13
  ['FILE_ID', '8427', '5479', '4401', '7623', '7643', '9812'], // 14
  ['FILE_ID', '9871', '5349', '6712', '1001', '1562', '6503'] // 15
];

var ans = [
  '1 = 1034',
  '2 = 3298',
  '3 = 6374',
  '4 = 1382',
  '5 = 7938',
  '6 = 6198',
  '7 = 5391',
  '8 = 1234',
  '9 = 4762',
  '10 = 6531',
  '11 = 9957',
  '12 = 7130',
  '13 = 6484',
  '14 = 8427',
  '15 = 5349'
]

function capcthas(msg) {
  var chatID = msg.chat.id
  var db = new telegram.user()

  var rand = Math.floor(Math.random() * 15);
  var pesan = '✳️ Verifikasi bahwa anda adalah manusia.\nSilahkan tekan angka dibawah yang sesuai dengan gambar diatas.\n\n🤝 Kamu hanya memiliki <b>3</b> kesempatan.';
  var jwb = ['1034', '6374', '7938', '1382', '3298', '6198'];
  var init = tanya[rand];
  var key = [];
  var keypad = [];
  for (x = 1; x < init.length; x++) {
    if (x % Number(3)) {
      key.push({ text: init[x], callback_data: init[x] });
    } else {
      key.push({ text: init[x], callback_data: init[x] });
      keypad.push(key);
      key = [];
    }
  }
  if (key) { keypad.push(key); }
  var keybMsg = { inline_keyboard: keypad }
  var data = {
    chat_id: String(msg.chat.id),
    photo: init[0],
    caption: pesan,
    parse_mode: 'html',
    reply_markup: JSON.stringify(keybMsg)
  }
  tg.requestForm('sendPhoto', data)
  db.setValue('batas' + chatID, 2);
  db.setValue('captcha_gmbr_' + chatID, init[0])
  db.setValue('captcha_keyb_' + chatID, JSON.stringify(keybMsg))
  return;
}


