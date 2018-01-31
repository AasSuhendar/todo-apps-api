# language: id

Fitur: Todo
  Untuk mengatur mengatur pekerjaan
  Sebagai sekertaris 
  Melani ingin mengatur daftar pekerjaannya

  Skenario: Membuat pekerjaan baru
    Dengan Melani memiliki pekerjaan yang harus dimasukan ke sistem dengan judul "Menyiapkan ruang rapat" 
    Ketika Melani memasukan pekerjaan 
    """
    {
      name: 'Todo 1',
      description: 'Todo 1 descriptions bla bla',
      status: 'Next task'
    }
    """
    Maka Sistem menyimpan pekerjaan tersebut dan menampilkan pesan "Sukses Menyimpan Pekerjaan"
