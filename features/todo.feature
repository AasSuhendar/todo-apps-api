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

  Skenario: Melihat daftar pekerjaan
    Dengan Melani ingin melihat daftar pekerjaannya yang ada di sistem
    Ketika Melani melakukan GET request ke sistem "/api/todo-list"
    Maka Sistem menampilkan daftar pekerjaan tersebut dan menampilkan pesan "Get list todo successfuly"

  Skenario: Merubah sebuah pekerjaan 
    Dengan Melani menginginkan merubah sebuah pekerjaan yang telah dimasukan ke sistem dengan judul "Menyiapkan ruang rapat" 
    Ketika Melani memasukan pekerjaan yang akan di rubah:
    """
    {
      "name": "Menyiapkan ruang rapat",
      "description": "Menyiapkan ruang rapat tgl bla bla",
      "status": "Done"
    }
    """
    Maka Sistem merubah pekerjaan tersebut dan menampilkan pesan "Update new todo successfuly"

  Skenario: Menghapus sebuah pekerjaan
    Dengan Melani ingin menghapus pekerjaannya yang ada di sistem yang bernama "Menyiapkan ruang rapat"
    Ketika Melani melakukan DELETE request ke sistem "/api/todo-list/"
    Maka Sistem menghapus pekerjaan tersebut dan menampilkan pesan "Delete new todo successfuly"