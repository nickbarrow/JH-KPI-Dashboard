const Modal = {
  modal: document.getElementById("modal"),
  show: function (data) {
    if (!this.modal) this.refreshModal()
    this.modal.classList.add('active')
    
    if (data) {
      if (typeof data == 'string') {
        this.modal.querySelector('.modal-body').innerHTML = data;
      } else if (typeof data == 'object') {
        this.modal.querySelector('.modal-body > textarea').value = JSON.stringify(data, null, 2);
      }
    }
  },
  hide: function () {
    this.modal.classList.remove('active');
    let $copyBtn = $('.modal-buttons > button.copy')
    if ($copyBtn.length) $copyBtn.remove()
  },
  copy: function () {
    this.modal.querySelector('.modal-body > textarea').select();
    document.execCommand('copy');
  },
  refreshModal: function () {
    this.modal = document.getElementById("modal")
  }
}