# language: id

Fitur: Todo
  Untuk mengatur pekerjaan
  Sebagai sekrtaris 
  Melani ingin mengatur daftar pekerjaannya

  Skenario: Membuat pekerjaan baru
    Dengan Melani memiliki pekerjaan yang harus dimasukan ke sistem dengan judul "Menyiapkan ruang rapat" 
    Ketika Melani memasukan pekerjaan:
    """
    {
      "name": "Menyiapkan ruang rapat",
      "description": "Menyiapkan ruang rapat tgl bla bla",
      "status": "Next task"
    }
    """
    Maka Sistem menyimpan pekerjaan tersebut dan menampilkan pesan "Insert new todo successfuly"
