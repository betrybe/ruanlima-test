function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
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
    }

    remover(id){
      for (var i = 0; i < this.produtos.length; i++) {
        if (this.produtos[i].id == id) {
          this.produtos.splice(i, 1);
        }
      }
      this.lista();
    }

    limpar(){
      this.produtos = new Object;
      const elValor = document.getElementById('empty-cart');
      elValor.innerHTML = 'Valor: 0,00';
      const div = document.getElementById('lista-carrinho');
      div.innerHTML = '';
    }

    lista(){
      const element = document.getElementById('lista-carrinho');
      element.innerHTML = '';
      if (this.produtos != null) {
        var valorFinal = null;
        for (var i = 0; i < this.produtos.length; i++) {
          element.innerHTML += `
          <ul>
            <li>`+this.produtos[i].name+` </li>
            <li>Valor: `+this.produtos[i].price+`</li>
            <li><button type="button" class="btn btn-danger" onClick="removerCarrinho('`+this.produtos[i].id+`')" name="button">Remover</button></li>
          </ul>
          `;

          if (valorFinal == null) {
            valorFinal = this.produtos[i].price;
          }else{
            valorFinal = parseFloat(valorFinal) + parseFloat(this.produtos[i].price);
          }
        }

        const elValor = document.getElementById('empty-cart');
        elValor.innerHTML = `Valor Total: `+valorFinal;
      }
    }

  }
  const carrinho = new Carrinho();

  function buscar(){
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

  buscar();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = () => { };
