// masukkan TOKEN BOT dari BOT Father
const token = 'TOKEN_BOT_ANDA'
const tg = new telegram.daftar(token)

// masukkan ID kamu, jika belum tau cek di @strukturbot
const adminBot = ID_ANDA
const ubot = "USERNAME_BOT_ANDA"
const aname = "USERNAME_PEMILIK_BOT"
const version = "JavaScript"
const ver = "CUSTOM_VERSI"
const chlog = ID_GRUP_LOG_ANDA

// jika debug true, akan mengirimkan struktur JSON ke admin bot
const debug = false

// -- fungsi telegram

// cek informasi bot
function getMe() {
  let me = tg.getMe()
  return Logger.log(me)
}

function setWebhook() {
  var url = "URL_WEBHOOK"
  var mx = 100;
  var drp = false;
  var r = tg.request('setWebhook', {url: url, ip_address: "172.217.168.206", drop_pending_updates: drp, max_connections: mx})
  return Logger.log(r)
}

// cek info hook bot
function getWebhookInfo() {
  let hasil = tg.getWebhookInfo()
  return Logger.log(hasil)
}

// hapus hook
function deleteWebhook() {
  let hasil = tg.deleteWebhook()
  return Logger.log(hasil)
}
