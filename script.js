let cart = [];
let modalQt = 1;
let modalKey = 0;

const C = (el)=>document.querySelector(el); // função para utilizar o querySelector(retorna apenas um item)
const CS = (el)=>document.querySelectorAll(el);//função para utilizar o querySelectorAll (retorna todos itens)

// Listagem das pizzas

pizzaJson.map((item, index)=>{
   let pizzaItem = C('.models .pizza-item').cloneNode(true); //clona a estrutura do html pizza-item
   
   pizzaItem.setAttribute('data-key', index); //setAttribute(seta o atributo)configura a chave de uma pizza específica quando clicada
   pizzaItem.querySelector('.pizza-item--img img').src = item.img;
   pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`; // `R$ ${item.price.toFixed(2)}` é um template string para formatar o valor do preço, o toFixed formata dois números apos o ponto.
   pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
   pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
   pizzaItem.querySelector('a').addEventListener('click', (e)=>{ // evento de click
      e.preventDefault();

      let key = e.target.closest('.pizza-item').getAttribute('data-key'); //e.target (clicar no próprio elemento), closest (ache o elemento mais próximo), getAttribute (pegar o atributo)
      modalQt = 1;
      modalKey = key;

      C('.pizzaBig img').src = pizzaJson[key].img;
      C('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
      C('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
      C('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
      C('.pizzaInfo--size.selected').classList.remove('selected');// remove a seleção to tamanho da pizza
      CS('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2) {// se o index dos tamanhos das pizzas for igual a 2 vai aplicar o selected no elemento
               size.classList.add('selected'); 
            }
            
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
      });


      C('.pizzaWindowArea').style.opacity = 0;
      C('.pizzaWindowArea').style.display = 'flex';
      setTimeout(()=>{
         C('.pizzaWindowArea').style.opacity = 1;
      }, 250);
   });


   C('.pizza-area').append(pizzaItem);// o append pega o conteudo que tem dentro de pizza-area e adiciona outro conteudo
});

//Eventos do Modal

function closeModal() {
   C('.pizzaWindowArea').style.opacity = 0;
   setTimeout(()=>{
      C('.pizzaWindowArea').style.display = 'none';
   }, 500);
}
CS('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
   item.addEventListener('click', closeModal);
});

C('.pizzaInfo--qtmenos').addEventListener('click', ()=>{ //ação de click em botão menos
   if(modalQt > 1) {
      modalQt--;
      C('.pizzaInfo--qt').innerHTML = modalQt;
   }
});

C('.pizzaInfo--qtmais').addEventListener('click', ()=>{//ação de click em botão mais
   modalQt++;
   C('.pizzaInfo--qt').innerHTML = modalQt;
});

CS('.pizzaInfo--size').forEach((size, sizeIndex)=>{
  size.addEventListener('click', (e)=>{ //serve para selecionar e remover seleção quando se clica
      C('.pizzaInfo--size.selected').classList.remove('selected'); //remove seleção
      size.classList.add('selected'); //adiciona seleção
  });
});

C('.pizzaInfo--addButton').addEventListener('click', ()=>{
   let size = parseInt(C('.pizzaInfo--size.selected').getAttribute('data-key'));

   let identifier = pizzaJson[modalKey].id+'@'+size;

   let key = cart.findIndex((item)=> item.identifier == identifier);

   if(key > -1) {
      cart[key].qt += modalQt;
   } else {
      cart.push({
         identifier,
         id:pizzaJson[modalKey].id,
         size,
         qt:modalQt
      });
   }

   updateCart();
   closeModal();
});
   C('.menu-openner').addEventListener('click', ()=> {
      if(cart.length > 0) {
         C('aside').style.left = '0';
      }
   });
   C('.menu-closer').addEventListener('click', ()=>{
      C('aside').style.left = '100vw';
   });
function updateCart() {
   C('.menu-openner span').innerHTML = cart.length;

   if(cart.length > 0){
      C('aside').classList.add('show');
      C('.cart').innerHTML = '';

      let subtotal = 0;
      let desconto = 0;
      let total = 0;

      for(let i in cart) {
         let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
         subtotal += pizzaItem.price * cart[i].qt;

         let cartItem = C('.models .cart--item').cloneNode(true);

         let pizzaSizeName;
         switch(cart[i].size) {
            case 0:
               pizzaSizeName = 'P';
               break;
            case 1:
               pizzaSizeName = 'M';
               break;
            case 2:
                pizzaSizeName = 'G';
                break;      
         }

         let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

         cartItem.querySelector('img').src = pizzaItem.img;
         cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
         cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
         cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
            if(cart[i].qt > 1){
               cart[i].qt--;
            }else {
               cart.splice(i, 1);
            }
            updateCart();
         });
         cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
            cart[i].qt++;
            updateCart();
         });

         C('.cart').append(cartItem);
      }

      desconto = subtotal * 0.1;
      total = subtotal - desconto;

      C('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
      C('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
      C('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
   }else {
      C('aside').classList.remove('show');
      C('aside').style.left = '100vw';
   }
}