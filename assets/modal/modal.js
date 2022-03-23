const Modal = {
  modal: document.getElementById("modal"),
  show: function (data) {
    if (data) {
      if (typeof data == 'string') {
        this.modal.querySelector('.modal-body').innerHTML = data;
      } else if (typeof data == 'object') {
        this.modal.querySelector('.modal-body > textarea').value = JSON.stringify(data, null, 2);

        this.modal.querySelector('.modal-body > textarea').focus();
        this.modal.querySelector('.modal-body > textarea').select();
      }
    }
    
    this.modal.classList.add('active')
  },
  hide: function () {
    this.modal.classList.remove('active')
  }
}