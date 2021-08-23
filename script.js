  function adicionarCarrinho(id, name, price){
    carrinho.adicionar(id, name, price);
    carrinho.lista();
  }

  function removerCarrinho(id){
    carrinho.remover(id);
  }

  function cartItemClickListener(){
    carrinho.limpar();
  }

  class Carrinho{
    constructor(){
      this.produtos = [];
    }

    adicionar(id, name, price){
      this.produtos.push({id: id, name: name, price: price});
      localStorage.setItem('produtos', JSON.stringify(this.produtos));
    }

    remover(id){
      for (var i = 0; i < this.produtos.length; i++) {
        if (this.produtos[i].id == id) {
          this.produtos.splice(i, 1);
        }
      }
      var storage = localStorage.getItem('produtos');
      storage = JSON.parse(storage);
      for (var i = 0; i < storage.length; i++) {
        if (storage[i].id == id) {
          storage.splice(i, 1);
        }
      }
      localStorage.setItem('produtos', JSON.stringify(storage));
      this.lista();
    }

    limpar(){
      this.produtos = [];
      const elValor = document.getElementById('valor-final');
      elValor.innerHTML = 'Valor: 0,00';
      const div = document.getElementById('lista-carrinho');
      div.innerHTML = '';
      var storage = localStorage.getItem('produtos');
      storage = JSON.parse(storage);
      storage = [];
      localStorage.setItem('produtos', JSON.stringify(storage));
    }

    lista(){
      var storage = localStorage.getItem('produtos');
      storage = JSON.parse(storage);
      if (storage.length > 0 || this.produtos > 0) {
        const element = document.getElementById('lista-carrinho');
        element.innerHTML = '';
        var valorFinal = null;
        var produtos = [];
        if (storage.length > 0 ) {
          produtos = storage;
        }else{
          produtos = this.produtos;
        }
        for (var i = 0; i < produtos.length; i++) {
          element.innerHTML += `
          <ul>
            <li>`+produtos[i].name+` </li>
            <li>Valor: `+produtos[i].price+`</li>
            <li><button type="button" class="btn btn-danger" onClick="removerCarrinho('`+produtos[i].id+`')" name="button">Remover</button></li>
          </ul>
          `;
          if (valorFinal == null) {
            valorFinal = produtos[i].price;
          }else{
            valorFinal = parseFloat(valorFinal) + parseFloat(produtos[i].price);
          }
        }
        const elValor = document.getElementById('valor-final');
        elValor.innerHTML = `Valor Total: `+valorFinal;
      }

      if (storage.length == 0 && this.produtos == 0) {
        var limpar = document.getElementById('lista-carrinho');
        limpar.innerHTML = '';
        const el = document.getElementById('valor-final');
        el.innerHTML = '';
      }
    }

  }

  const carrinho = new Carrinho();

  function buscar(){
    var storage = localStorage.getItem('produtos');
    storage = JSON.parse(storage);
    if (storage.length > 0 ) {
      carrinho.lista();
    }
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
      .then(res => res.json()
    ).then(
      res =>{
        for (var i = 0; i < res.results.length; i++) {
          createProductItemElement(res.results[i]);
        }
      }
    ).catch(error =>{
      console.log(error);
    })
  }

  function createProductItemElement(produto){
    var div = document.getElementById('lista-produtos');
    div.innerHTML += `
    <div class="col-md-4 col-card">
      <div class="card">
        <img class="card-img-top" src="`+produto.thumbnail+`" alt="Card image cap">
        <div class="card-body">
          <h5 class="card-title">`+produto.title+`</h5>
          <a href="#" class="btn btn-primary" onClick="adicionarCarrinho('`+produto.id+`', '`+produto.title+`', '`+produto.price+`')">Adicionar</a>
        </div>
      </div>
    </div>`;
  }

  window.onload = function(){
    buscar();
  }
//comentario para comitar
