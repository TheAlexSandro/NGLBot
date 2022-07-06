// fungsi buat handle hanya menerima pesan berupa POST, kalau GET keluarkan pesan error
function doGet(e) {
  return tg.util.outputText("Hanya data POST yang kita proses yak!");
}

// fungsi buat handle pesan POST
function doPost(e) {
  // data e kita verifikasi
  let update = tg.doPost(e);

  try {
    if (debug) return tg.sendMessage(adminBot, JSON.stringify(update, null, 2))
    prosesPesan(update)
  } catch (e) {
    tg.sendMessage(adminBot, e.message)
  }

}

// fungsi utama untuk memproses segala pesan yang masuk
function prosesPesan(update) {

  // deteksi callback
  if (update.callback_query) {
    // proses di halaman berikutnya, biar gak terlalu panjang           
    return prosesCallback(update.callback_query)
  }

  // deteksi tipe message
  if (update.message) {

    // EVENT

    // penyederhanaan variable
    var msg = update.message;

    var db = new telegram.user();
    var helper = tg.util
    var btn = tg.button
    var dari = msg.from
    var chatID = msg.chat.id
    var nn = helper.clearHTML(dari.first_name)
    var username = dari.username
    if (username) {
      var un = "@" + username
    } else {
      var un = "<a href='tg://user?id=" + chatID + "'>" + nn + "</a>"
    }
    var pvtban = db.getValue('pvt_ban' + chatID)
    var acc = db.getValue('account_' + chatID)
    var gtmaintenance = db.getValue('main_' + token)

    if (gtmaintenance) {
      if (msg.from.id == adminBot) {
      } else {
        return tg.sendMsg(msg, "⚠️ Bot sedang dalam pemeliharaan, mohon tunggu hingga proses selesai.")
      }
    }

    if (pvtban) {
      return tg.sendMsg(msg, "⚠️ Anda telah diblokir, anda tidak dapat menggunakan bot ini.")
    }

    try {
      var cck;
      if (cck = /^\/start ngl_(.*)/i.exec(msg.text)) {
        var th = tg.sendMsg(msg, "⏳ Memproses...")
        var pesanTag = tagCari(cck[1])
        var gtprofil = db.getValue('profil_akun' + Number(pesanTag))

        if (pesanTag) {
          if (gtprofil) {
            try {
              tg.deleteMessage(msg.chat.id, th.result.message_id)
            } catch (e) { }

            var pesan = "❇️ Silahkan kirim pesan anonim untuk pengguna: <b>@" + helper.clearHTML(cck[1]) + "</b>"
            var keyb = []

            keyb[0] = [
              btn.text('❌ Batal', 'ngl_cancel')
            ]
            var keybMsg = { inline_keyboard: keyb }

            var data = {
              chat_id: String(chatID),
              photo: gtprofil,
              caption: pesan,
              parse_mode: 'html',
              reply_markup: JSON.stringify(keybMsg)
            }

            tg.requestForm('sendPhoto', data)
            db.setValue('session_ngl_' + chatID, Number(pesanTag))
            return;
          } else {
            try {
              tg.deleteMessage(msg.chat.id, th.result.message_id)
            } catch (e) { }

            var pesan = "❇️ Silahkan kirim pesan anonim untuk pengguna: <b>@" + helper.clearHTML(cck[1]) + "</b>"
            var keyb = []

            keyb[0] = [
              btn.text('❌ Batal', 'ngl_cancel')
            ]

            tg.sendMsgKeyboardInline(msg, pesan, keyb, 'html', true)
            db.setValue('session_ngl_' + chatID, Number(pesanTag))
            return;
          }
        } else {
          try {
            tg.deleteMessage(msg.chat.id, th.result.message_id)
          } catch (e) { }

          return tg.sendMsg(msg, "❌ Pengguna tidak ditemukan, bisa terjadi karena pemilik tautan ini telah mengganti usernamenya atau menghapus akunnya.", 'html', true, true)
        }
      }

      if (/^\/start start_header$/i.exec(msg.text)) {
        var pesan = "👋🏻 Hii " + un + ", saya adalah NGL (Not Gonna Lie) Bot."
        pesan += "\n\n👉 Cara menggunakan saya adalah dengan <b>membuat akun</b> terlebih dahulu. Kamu dapat membuat membuat akun dengan menekan <u>tombol dibawah ini</u>, atau dengan menekan /account"
        pesan += "\n\n🛠 Setelah membuat akun, kamu dapat mengelola akun kamu dengan mengirim /settings"
        pesan += "\n\n💡 Dengan menggunakan bot ini, anda menyetujui <a href='https://github.com/TheAlexSandro/NGLBot/blob/main/privacy-policy.md'>Kebijakan Privasi</a> bot ini."
        var keyb = []

        keyb[0] = [
          btn.text('👤 Buat Akun', 'create_account')
        ]
        keyb[1] = [
          btn.text('ℹ️ Tentang Bot Ini', 'about_')
        ]

        tg.sendMsgKeyboardInline(msg, pesan, keyb, 'html', true)
        var psn = "Ada yang mengakses saya:"
        psn += "\n\nNama: " + un
        psn += "\nID: <code>" + dari.id + "</code>"
        tg.sendMessage(adminBot, psn, 'html', true)
        return;
      }

      // IF USERS CLICK START
      var pola = /^\/start$/i
      if (pola.exec(msg.text)) {
        var pesan = "👋🏻 Hii " + un + ", saya adalah NGL (Not Gonna Lie) Bot."
        pesan += "\n\n👉 Cara menggunakan saya adalah dengan <b>membuat akun</b> terlebih dahulu. Kamu dapat membuat membuat akun dengan menekan <u>tombol dibawah ini</u>, atau dengan menekan /account"
        pesan += "\n\n🛠 Setelah membuat akun, kamu dapat mengelola akun kamu dengan mengirim /settings"
        pesan += "\n\n💡 Dengan menggunakan bot ini, anda menyetujui <a href='https://github.com/TheAlexSandro/NGLBot/blob/main/privacy-policy.md'>Kebijakan Privasi</a> bot ini."
        var keyb = []

        keyb[0] = [
          btn.text('👤 Buat Akun', 'create_account')
        ]
        keyb[1] = [
          btn.text('ℹ️ Tentang Bot Ini', 'about_')
        ]

        tg.sendMsgKeyboardInline(msg, pesan, keyb, 'html', true)
        var psn = "Ada yang mengakses saya:"
        psn += "\n\nNama: " + un
        psn += "\nID: <code>" + dari.id + "</code>"
        tg.sendMessage(adminBot, psn, 'html', true)
        return;
      }

      var pola = /^\/settings$/i
      if (pola.exec(msg.text)) {
        if (!acc) {
          return tg.sendMsg(msg, "⚠️ Hei! Kamu tidak memiliki akun, silahkan kirim /account untuk membuat akun.")
        } else {
          var pesan = "⚙️ Dibawah ini adalah pengaturan untuk akun kamu."
          var keyb = []

          keyb[0] = [
            btn.text('👤 Profil Saya', 'my_profile_')
          ]
          keyb[1] = [
            btn.text('🗑 Hapus Akun', 'delete_acc_')
          ]

          return tg.sendMsgKeyboardInline(msg, pesan, keyb, 'html', true)
        }
      }

      var pola = /^\/me$/i
      if (pola.exec(msg.text)) {
        if (!acc) {
          return tg.sendMsg(msg, "⚠️ Hei! Kamu tidak memiliki akun, silahkan kirim /account untuk membuat akun.")
        } else {
          var gb = tg.sendMsg(msg, "⏳ Memproses...")
          var gtprofil = db.getValue('profil_akun' + chatID)

          if (username) {
            var hj = "@" + username
          } else {
            var hj = "--"
          }

          if (gtprofil) {
            try {
              tg.deleteMessage(chatID, gb.result.message_id)
            } catch (e) { }

            var pesan = "├──「👤 <b>Informasi</b>"
            pesan += "\n│"
            pesan += "\n├• 🧑 Nama Akun: " + acc
            pesan += "\n├• 📇 ID: <code>" + chatID + "</code>"
            pesan += "\n├• 🐱 Nama TG: " + nn
            pesan += "\n├• 🌐 Username TG: " + hj
            pesan += "\n├• 🏞 has_profile_photo: true"
            pesan += "\n└• 🔗 Link: https://t.me/" + ubot + "?start=ngl_" + acc
            var keyb = []

            keyb[0] = [
              btn.url('Bagikan ↗️', 'https://t.me/share/url?url=https://t.me/' + ubot + '?start=ngl_' + acc)
            ]
            var keybMsg = { inline_keyboard: keyb }

            var data = {
              chat_id: String(chatID),
              photo: gtprofil,
              caption: pesan,
              parse_mode: 'html',
              reply_markup: JSON.stringify(keybMsg)
            }

            return tg.requestForm('sendPhoto', data)
          } else {
            try {
              tg.deleteMessage(chatID, gb.result.message_id)
            } catch (e) { }

            var pesan = "├──「👤 <b>Informasi</b>"
            pesan += "\n│"
            pesan += "\n├• 🧑 Nama Akun: " + acc
            pesan += "\n├• 📇 ID: <code>" + chatID + "</code>"
            pesan += "\n├• 🐱 Nama TG: " + nn
            pesan += "\n├• 🌐 Username TG: " + hj
            pesan += "\n├• 🏞 has_profile_photo: false"
            pesan += "\n└• 🔗 Link: https://t.me/" + ubot + "?start=ngl_" + acc
            var keyb = []

            keyb[0] = [
              btn.url('Bagikan ↗️', 'https://t.me/share/url?url=https://t.me/' + ubot + '?start=ngl_' + acc)
            ]

            return tg.sendMsgKeyboardInline(msg, pesan, keyb, 'html', true)
          }
        }
      }

      var pola = /^\/ngl$/i
      if (pola.exec(msg.text)) {
        if (!acc) {
          return tg.sendMsg(msg, "⚠️ Hei! Kamu tidak memiliki akun, silahkan kirim /account untuk membuat akun.")
        } else {
          var pesan = "ℹ️ Menu untuk mengganti username telah dipindahkan, jika kamu ingin mengganti username silahka mengirim /settings atau menekan tombol dibawah."
          var keyb = []

          keyb[0] = [
            btn.text('⚙️ Pengaturan', 'settings_')
          ]

          return tg.sendMsgKeyboardInline(msg, pesan, keyb, 'html', true)
        }
      }

      var pola = /^\/account$/i
      if (pola.exec(msg.text)) {
        if (acc) {
          return tg.sendMsg(msg, "⚠️ Kamu saat ini sudah memiliki akun. Untuk mengganti username akun kamu, silahkan kirim /ngl.")
        } else {
          var pesan = "❇️ Silahkan masukkan nama username yang kamu inginkan (random).\n\n⚠️ Jangan menggunakan emoji, karakter unicode, dan spasi!"
          pesan += "\n\n💡 Dengan membuat akun, berarti anda menyetujui <a href='https://github.com/TheAlexSandro/NGLBot/blob/main/privacy-policy.md'>Kebijakan Privasi</a> bot ini."
          var keyb = []

          keyb[0] = [
            btn.text('❌ Batal', 'cancel_')
          ]

          tg.sendMsgKeyboardInline(msg, pesan, keyb, 'html', true)
          db.setValue('session_' + chatID, pesan)
          return;
        }
      }

      var pola = /^\/req$/i
      if (pola.exec(msg.text)) {
        if (msg.from.id == adminBot) {
          var pesan = "🎛 Dari menu ini, kamu dapat melakukan request fitur baru ke admin bot."
        } else {
          if (!acc) {
            return tg.sendMsg(msg, "⚠️ Hei! Kamu tidak memiliki akun, silahkan kirim /account untuk membuat akun.")
          } else {
            return tg.sendMsg(msg, "⚠️ Fitur ini belum tersedia untuk akun anda.")
          }
        }
      }

      /*** PERINTAH ADMIN ***/
      var pola = /^([\/]ban+ )/i
      if (cocok = pola.exec(msg.text)) {
        if (msg.from.id == adminBot) {
          var cck = msg.text.replace(cocok[1], '')

          var pesan = "✅ Pengguna diblokir."
          tg.sendMsg(msg, pesan)
          db.setValue('pvt_ban' + String(cck), pesan)
          return;
        }
      }

      var pola = /^([\/]unban+ )/i
      if (cocok = pola.exec(msg.text)) {
        if (msg.from.id == adminBot) {
          var cck = msg.text.replace(cocok[1], '')

          var pesan = "✅ Pengguna di un-blokir."
          tg.sendMsg(msg, pesan)
          db.delete('pvt_ban' + String(cck))
          return;
        }
      }

      var pola = /^\/js$/i
      if (pola.exec(msg.text)) {
        if (msg.from.id == adminBot) {
          var msgr = msg.reply_to_message
          var js = JSON.stringify(msgr, null, 2)
          tg.sendMsg(msg, "<code>" + js + "</code>", 'html', true)
          return;
        }
      }

      if (cck = /^[\/]hps\s(.*)/i.exec(msg.text)) {
        if (msg.from.id == adminBot) {
          var p = tagCari(cck[1])

          if (p) {
            db.delete('account_' + Number(p))
            hapusTag(cck[1])
            return tg.sendMsg(msg, "✅ Akun <code>" + helper.clearHTML(cck[1]) + "</code> telah dihapus.", 'html', true)
          } else {
            return tg.sendMsg(msg, "ℹ️ Akun <code>" + helper.clearHTML(cck[1]) + "</code> tidak ditemukan untuk dihapus.", 'html', true)
          }
        }
      }

      var pola = /^\/admin$/i
      if (pola.exec(msg.text)) {
        if (msg.from.id == adminBot) {
          var pesan = "⚙️ Berikut pengaturan untuk admin bot."
          var keyb = []

          keyb[0] = [
            btn.text('⚠️ Maintenance', 'mainte_')
          ]

          return tg.sendMsgKeyboardInline(msg, pesan, keyb, 'html', true)
        }
      }

      var pola = /^\/b$/i
      if (pola.exec(msg.text)) {
        if (msg.from.id == adminBot) {
          if (msg.reply_to_message) {
            var msgr = msg.reply_to_message
            var data = [ID_PENGGUNA_BOT_ANDA]

            var berhasil = 0
            var gagal = 0
            data.forEach((id) => {
              try {
                tg.sendMessage(id, "🔔 <b>BROADCAST</b> 👇", 'html', true)
                tg.copyMessage(id, chatID, msgr.message_id)
                berhasil += 1
              } catch {
                gagal += 1
              }
            })
            return tg.sendMessage(chatID, "✅ Berhasil: " + berhasil + "\n❌ Gagal: " + gagal)
          } else {
            return tg.sendMsg(msg, "Silahkan reply pesan")
          }
        }
      }

      /*** PERINTAH ADMIN ***/

      // SESSION
      var gtses = db.getValue('session_' + chatID)
      var gtngl = db.getValue('ngl_' + chatID)
      var gtsesgln = db.getValue('session_ngl_' + chatID)
      var gtrply = db.getValue('reply__' + chatID)
      var gtrplyid = db.getValue('reply_id_' + chatID)
      var gtgantipp = db.getValue('ganti_profile_' + chatID)
      var gtpasang = db.getValue('pasang_profil_' + chatID)

      if (gtses) {
        if (msg.text) {
          var txt = msg.text
          var p = tg.sendMsg(msg, "⏳ Memproses...", 'html', true)
          var pesanTag = tagCari(txt)
          //var r = tg.getChat(chatID)

          tg.deleteMessage(chatID, p.result.message_id)
          if (txt.includes('`') || txt.includes('~') || txt.includes('!') || txt.includes('@') || txt.includes('#') || txt.includes('$') || txt.includes('%') || txt.includes('^') || txt.includes('&') || txt.includes('*') || txt.includes('(') || txt.includes(')') || txt.includes('-') || txt.includes('+') || txt.includes('=') || txt.includes('[') || txt.includes(']') || txt.includes('{') || txt.includes('}') || txt.includes('|') || txt.includes('\\') || txt.includes(';') || txt.includes(':') || txt.includes('"') || txt.includes("'") || txt.includes('<') || txt.includes('>') || txt.includes(',') || txt.includes('.') || txt.includes('/') || txt.includes('?')) return tg.sendMsg(msg, '⚠️ Username tidak boleh mengandung simbol, kecuali: "_"')
          if (txt.startsWith('_')) return tg.sendMsg(msg, '⚠️ Username tidak boleh diawali dengan "_", cobalah untuk menggunakannya di akhir atau di tengah username.')
          if (txt.length < 4) {
            return tg.sendMsg(msg, "⚠️ Username tidak boleh kurang dari 4 karakter.")
          } else if (txt.length > 15) {
            return tg.sendMsg(msg, "⚠️ Username tidak boleh lebih dari 15 karakter.")
          }
          if (pesanTag) {
            return tg.sendMsg(msg, "⚠️ Username ini telah digunakan, silahkan gunakan username yang lain.", 'html', true)
          } else {
            try {
              capcthas(msg)
              db.setValue('account_' + chatID, txt)
              return;
            } catch(e) {
              var pht = "FILE_ID"
              var pesan = '✳️ Verifikasi bahwa anda adalah manusia.\nSilahkan tekan angka dibawah yang sesuai dengan gambar diatas.\n\n🤝 Kamu hanya memiliki <b>3</b> kesempatan.';
              var keyb = []

              keyb[0] = [
                btn.text('9876', '9876'),
                btn.text('0734', '0734'),
                btn.text('7653', '7653')
              ]
              keyb[1] = [
                btn.text('9812', '9812'),
                btn.text('1034', '1034'),
                btn.text('7643', '7643')
              ]
              var keybMsg = { inline_keyboard: keyb }

              var data = {
                chat_id: String(msg.chat.id),
                photo: pht,
                caption: pesan,
                parse_mode: 'html',
                reply_markup: JSON.stringify(keybMsg)
              }
              tg.requestForm('sendPhoto', data)
              db.setValue('account_' + chatID, txt)
              db.setValue('batas' + chatID, 2);
              db.setValue('captcha_gmbr_' + chatID, pht)
              db.setValue('captcha_keyb_' + chatID, JSON.stringify(keybMsg))
              return;
            }
          }
        } else {
          return tg.sendMsg(msg, "⚠️ Hanya mendukung format teks, silahkan coba lagi.")
        }
      }

      if (gtngl) {
        if (msg.text) {
          var txt = msg.text

          var p = tg.sendMsg(msg, "⏳ Memproses...", 'html', true)
          var pesanTag = tagCari(txt)
          //var r = tg.getChat(chatID)

          tg.deleteMessage(chatID, p.result.message_id)
          if (txt.includes('`') || txt.includes('~') || txt.includes('!') || txt.includes('@') || txt.includes('#') || txt.includes('$') || txt.includes('%') || txt.includes('^') || txt.includes('&') || txt.includes('*') || txt.includes('(') || txt.includes(')') || txt.includes('-') || txt.includes('+') || txt.includes('=') || txt.includes('[') || txt.includes(']') || txt.includes('{') || txt.includes('}') || txt.includes('|') || txt.includes('\\') || txt.includes(';') || txt.includes(':') || txt.includes('"') || txt.includes("'") || txt.includes('<') || txt.includes('>') || txt.includes(',') || txt.includes('.') || txt.includes('/') || txt.includes('?')) return tg.sendMsg(msg, '⚠️ Username tidak boleh mengandung simbol, kecuali: "_"')
          if (txt.startsWith('_')) return tg.sendMsg(msg, '⚠️ Username tidak boleh diawali dengan "_", cobalah untuk menggunakannya di akhir atau di tengah username.')
          if (txt.length < 4) {
            return tg.sendMsg(msg, "⚠️ Username tidak boleh kurang dari 4 karakter.")
          } else if (txt.length > 15) {
            return tg.sendMsg(msg, "⚠️ Username tidak boleh lebih dari 15 karakter.")
          }
          if (pesanTag) {
            return tg.sendMsg(msg, "⚠️ Username ini telah digunakan, silahkan gunakan username yang lain.", 'html', true)
          } else {
            try {
              capcthas(msg)
              db.setValue('username_' + chatID, txt)
              return;
            } catch(e) {
              var pht = "FILE_ID"
              var pesan = '✳️ Verifikasi bahwa anda adalah manusia.\nSilahkan tekan angka dibawah yang sesuai dengan gambar diatas.\n\n🤝 Kamu hanya memiliki <b>3</b> kesempatan.';
              var keyb = []

              keyb[0] = [
                btn.text('6432', '6432'),
                btn.text('4781', '4781'),
                btn.text('8943', '8943')
              ]
              keyb[1] = [
                btn.text('4401', '4401'),
                btn.text('3298', '3298'),
                btn.text('0909', '0909')
              ]
              var keybMsg = { inline_keyboard: keyb }

              var data = {
                chat_id: String(msg.chat.id),
                photo: pht,
                caption: pesan,
                parse_mode: 'html',
                reply_markup: JSON.stringify(keybMsg)
              }
              tg.requestForm('sendPhoto', data)
              db.setValue('username_' + chatID, txt)
              db.setValue('batas' + chatID, 2);
              db.setValue('captcha_gmbr_' + chatID, pht)
              db.setValue('captcha_keyb_' + chatID, JSON.stringify(keybMsg))
              return;
            }
          }
        } else {
          return tg.sendMsg(msg, "⚠️ Hanya mendukung format teks. Silahkan coba lagi!")
        }
      }

      if (gtsesgln) {
        if (msg.text) {
          var pesan = "✅ Pesan anonim kamu telah terkirim."
          var keyb = []

          keyb[0] = [
            btn.url('Buat akun NGL-mu ↗️', 'https://t.me/' + ubot + '?start=start_header')
          ]

          var gt = tg.sendMsgKeyboardInline(msg, pesan, keyb, 'html', true)
          try {
            var psn = "💌 Ada pesan baru untukmu."
            psn += "\n—————————"
            psn += "\n" + helper.clearHTML(msg.text)
            var keyb = []

            keyb[0] = [
              btn.text('Reply ↪️', 'reply_' + chatID)
            ]
            /*keyb[1] = [
              btn.text('🔒 Blokir', 'blok_' + chatID + '_id_' + Number(gtsesgln))
            ]*/
            keyb[1] = [
              btn.text('❗️Laporkan', 'lapor_' + chatID + '_pelapor_' + Number(gtsesgln))
            ]

            tg.sendMessageKeyboardInline(Number(gtsesgln), psn, keyb, 'html', true)
          } catch (e) {
            try {
              tg.deleteMessage(chatID, gt.result.message_id)
            } catch (e) { }
            tg.sendMsg(msg, "❌ Error: <code>tidak dapat mengirim pesan karena pengguna memblokir bot.</code>", 'html', true)
          }
          db.delete('session_ngl_' + chatID)
          return;
        } else {
          return tg.sendMsg(msg, "⚠️ Hanya mendukung format teks. Silahkan coba lagi!")
        }
      }

      if (gtrply) {
        if (msg.text) {
          var pesan = "✅ Pesan balasan telah terkirim."
          tg.sendMsg(msg, pesan, 'html', true)
          var p = "📤 Kamu telah mendapat pesan balasan dari: <b>@" + acc + "</b>\n—————————\n<i>" + helper.clearHTML(msg.text) + "</i>"
          tg.sendMessage(gtrplyid, p, 'html', true)
          try {
            tg.deleteMessage(chatID, gtrply)
            tg.deleteMessage(chatID, msg.message_id)
          } catch (e) { }
          db.delete('reply__' + chatID)
          db.delete('reply_id_' + chatID)
          return;
        } else {
          return tg.sendMsg(msg, "⚠️ Hanya mendukung format teks. Silahkan coba lagi!")
        }
      }

      if (gtgantipp) {
        if (msg.photo) {
          var pht = msg.photo
          var pesan = "✅ Foto profil telah diganti, silahkan cek /me untuk melihatnya"
          var keyb = []

          keyb[0] = [
            btn.text('⬅️ Kembali', 'settings_')
          ]

          tg.sendMsgKeyboardInline(msg, pesan, keyb, 'html', true)
          db.setValue('profil_akun' + chatID, pht[0].file_id)
          db.delete('ganti_profile_' + chatID)
          return;
        } else {
          return tg.sendMsg(msg, "⚠️ Silahkan kirim foto yang ingin kamu pasang di profil!")
        }
      }

      if (gtpasang) {
        if (msg.photo) {
          var pht = msg.photo
          var pesan = "✅ Foto profil dipasang, silahkan cek /me untuk melihatnya"
          var keyb = []

          keyb[0] = [
            btn.text('⬅️ Kembali', 'settings_')
          ]

          tg.sendMsgKeyboardInline(msg, pesan, keyb, 'html', true)
          db.setValue('profil_akun' + chatID, pht[0].file_id)
          db.delete('pasang_profil_' + chatID)
          return;
        } else {
          return tg.sendMsg(msg, "⚠️ Silahkan kirim foto yang ingin kamu pasang di profil!")
        }
      }
    } catch (e) {
      var err = helper.clearHTML(e.message)
      var rgx = /Bad Request:(.*)"/gm
      var cck;
      if (cck = rgx.exec(err)) {
        tg.sendMsg(msg, "❌ Error:<code>" + cck[1] + "</code>", 'html', true)
        var psn = "❌ Ada error di:"
        psn += "\n\nNama: " + un
        psn += "\nID: <code>" + dari.id + "</code>"
        psn += "\nError: " + err
        return tg.sendMessage(adminBot, psn, 'html', true)
      } else {
        tg.sendMsg("❌ Error:<code>" + err + "</code>", 'html', true)
        var psn = "❌ Ada error di:"
        psn += "\n\nNama: " + un
        psn += "\nID: <code>" + dari.id + "</code>"
        psn += "\nError: " + err
        return tg.sendMessage(adminBot, psn, 'html', true)
      }
    }

    // akhir deteksi pesan text
  }
}
