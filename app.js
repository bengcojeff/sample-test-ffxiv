// Prices Control

const pricesControl = (() => {
    const itemNprice = {
        items: [],
        prices: [],
        sortedItems: [],
        sortedPrice: []
    };


    const totalSortedPrice = () => {
        let price = 0;
        itemNprice.sortedPrice.forEach(cur => {
            price = price + cur;
        })
        return price;
    };
    return {
        createdItem: (item) => {
            itemNprice.items.push(item);

            itemNprice.prices.push([]);
        },
        sortItem: (item) => {
            itemNprice.sortedItems.push(item);
        },
        createdPrice: (item, price, oldPrice) => {
            const itemList = document.querySelectorAll('.items-list');
            let getIndex
            itemList.forEach(cur => {
                if (cur.id === item) {
                    getIndex = cur.textContent;
                }
                return getIndex
            })

            let index = itemNprice.items.indexOf(getIndex);
            let removeThis = itemNprice.prices[index].indexOf(oldPrice)

            if (removeThis == -1) {
                itemNprice.prices[index].push(price);
            } else {
                itemNprice.prices[index][removeThis] = price;
            };

        },
        sortPrices: (item, price, condition) => {
            if (condition == 'new') {
                itemNprice.sortedPrice.push(price);
            } else {
                let index = itemNprice.sortedItems.indexOf(item);
                itemNprice.sortedPrice[index] = price;
            };
        },
        removeItem: (item, section) => {
            const index = itemNprice[section].indexOf(item);

            itemNprice[section].splice(index, 1);
            if (section == 'items') {
                itemNprice.prices.splice(index, 1);
            }
            else if (section == 'sortedItems') {
                itemNprice.sortedPrice.splice(index, 1);
            }
        },
        itemPrice: () => {
            return itemNprice;
        },
        getTotal: () => {
            return totalSortedPrice();
        },
        test: () => {
            console.log(itemNprice);
        }
    }
})();

// Controller
const controller = ((pricesCtrl) => {
    //**************** UI CTRLS *************************/
    const shortcut = {
        item: '#item',
        add: '#adds',
        itemStorage: '.item-storage',
        itemList: '.item-list',
        serverList: '.server-list',
        priceList: '.prices-list',

        // sorted
        sortBtn: '#sort',
        sortList: '.sort-list',
        sortedServer: '.sorted-server',
        sortedItem: '.sorted-item',
        sortedPrice: '.sorted-price'
    };

    const priceNcontrol = pricesCtrl.itemPrice();

    const convertID = (id) => {
        const splitID = id.split(' ');
        if (splitID.length > 1) {
            return (`${splitID[0]}-${splitID[1]}`);
        } else {
            return (splitID[0]);
        }
    }
    const convertPrice = (price) => {
        const priceString = price.toString();
        const priceLength = priceString.length;
        if (priceLength > 6) {
            return (`${priceString.substr(0, priceLength - 6)},${priceString.substr(priceLength - 6, 3)},${priceString.substr(priceLength - 3, 3)}`)
        } else if (priceLength <= 6 && priceLength > 3) {
            return (`${priceString.substr(0, priceLength - 3)},${priceString.substr(priceLength - 3, 3)}`)
        } else {
            return priceString;
        }
    }
    const convertPricetoNumber = (price) => {
        if (price !== 'Add a price') {
            const priceSplit = price.split(',');
            return parseFloat(priceSplit.join(""));
        }
    }

    const removeElement = (name, s, item, section) => {
        let decision = confirm('Do you want to delete?')
        if (decision) {
            document.querySelectorAll(`${s}${name}`).forEach(cur => {
                cur.parentNode.removeChild(cur);
            });
            pricesCtrl.removeItem(item, section);
        }
    }

    //***************************   CONTROLLER      **************************/
    // ADD AN ITEM
    const addItem = () => {
        const createdItem = document.querySelector(shortcut.item).value.trim();

        const element = document.querySelector(shortcut.itemStorage);
        const list = document.querySelectorAll(shortcut.serverList);

        // put the items to the dom
        if (createdItem !== '' && isNaN(createdItem) && priceNcontrol.items.indexOf(createdItem) == -1) {
            pricesCtrl.createdItem(createdItem);

            const item = `<td class='items-list' id='${convertID(priceNcontrol.items[priceNcontrol.items.length - 1])}'>${createdItem}</td>`;
            const price = `<td class='listofPrices' id='${convertID(priceNcontrol.items[priceNcontrol.items.length - 1])}'>Add a price</td>`;

            list.forEach(cur => {
                cur.insertAdjacentHTML("beforeend", price);
            })
            element.insertAdjacentHTML("beforeend", item);


            document.querySelector(shortcut.item).value = '';
        } else {
            alert(`THE ITEM HAS ALREADY BEEN PUT OOOOOR PUT A WORD!`);
        }

    }

    // add price
    const addPrice = (e) => {
        const target = e.target;
        const server = target.parentElement.className;
        const splitServer = server.split(' ')
        const priceTextContent = convertPricetoNumber(target.textContent);
        // change price
        if (target.className == 'listofPrices' || target.className.startsWith('changedPrice')) {
            let price = prompt('Put the price');
            if (!isNaN(price) && price !== null) {
                target.className = `changedPrice ${splitServer[1]}`;
                // put the price on the dom
                target.textContent = convertPrice(price);
                // put the price on the database
                pricesCtrl.createdPrice(target.id, parseFloat(price), priceTextContent);
            } else {
                alert('PUT A NUMBER!!');
            }
        }

        if (target.className == 'items-list') {
            removeElement(target.id, '#', target.textContent, 'items');
        }
    }
    var test = 'lol';

    const sortPrice = (e) => {
        for (i = 0; i < priceNcontrol.items.length; i++) {

            let lowestPrice = priceNcontrol.prices[i].map(cur => { return cur });

            lowestPrice.sort();

            let allPrice = document.querySelectorAll(`#${convertID(priceNcontrol.items[i])}`);
            let getitem;
            let getserver;
            let getprice = convertPrice(Math.min(...lowestPrice));
            allPrice.forEach(cur => {
                if (cur.textContent.includes(getprice)) {
                    const curSplit = cur.className.split(' ');
                    const server = curSplit[1];
                    getserver = server.toUpperCase(); // get server
                    getitem = priceNcontrol.items[i]; // get item
                }
            })
            let className = Math.floor(Math.random() * 100);
            console.log(priceNcontrol.sortedItems[i])
            if (getitem !== priceNcontrol.sortedItems[i]) {

                const server = `<td class='sorted-${className}' id='sortedServer'>${getserver}</td>`;
                const item = `<td class='sorted-${className}' id='sorted-${className}'>${getitem}</td>`;
                const price = `<td class='sorted-${className}'>${getprice}</td>`;

                document.querySelector(shortcut.sortedServer).insertAdjacentHTML("beforeend", server);
                document.querySelector(shortcut.sortedItem).insertAdjacentHTML("beforeend", item);
                document.querySelector(shortcut.sortedPrice).insertAdjacentHTML("beforeend", price);

                pricesCtrl.sortItem(getitem);
                pricesCtrl.sortPrices(getitem, convertPricetoNumber(getprice), 'new');
            }
            else if (priceNcontrol.sortedItems[i] == undefined) {
                alert(`Put a price at the item ${priceNcontrol.items[i]}.`);
            } else {
                document.querySelector(shortcut.sortedServer).childNodes[i + 5].textContent = getserver
                document.querySelector(shortcut.sortedItem).childNodes[i + 5].textContent = getitem
                document.querySelector(shortcut.sortedPrice).childNodes[i + 5].textContent = getprice
                pricesCtrl.sortPrices(getitem, convertPricetoNumber(getprice));
            }
        }
        // total
        if (test == 'lol') {
            document.querySelector(shortcut.sortedServer).insertAdjacentHTML("beforeend", `<td class='sorted-total'> Total </td>`);
            document.querySelector(shortcut.sortedItem).insertAdjacentHTML("beforeend", `<td class='sorted-totalPrice'> Prices </td>`);
            document.querySelector(shortcut.sortedPrice).insertAdjacentHTML("beforeend", `<td class='sorted-totalNumbers'> ${convertPrice(pricesCtrl.getTotal())} </td>`);
            test = 'yow';
        } else {
            const total = document.querySelector('.sorted-total');
            const totalPrice = document.querySelector('.sorted-totalPrice');
            const totalNumbers = document.querySelector('.sorted-totalNumbers');

            totalNumbers.textContent = convertPrice(pricesCtrl.getTotal());

            total.parentNode.appendChild(total);
            totalPrice.parentNode.appendChild(totalPrice);
            totalNumbers.parentNode.appendChild(totalNumbers);

        }

    };

    const deleteSorted = (e) => {
        if (e.target.id == 'sortedServer') {
            let item;
            document.querySelectorAll(`.${e.target.className}`).forEach(cur => {
                if (cur.id == cur.className) {
                    item = cur.textContent;
                };
            });
            removeElement(e.target.className, '.', item, 'sortedItems');
        }
    }
    // buttons
    document.querySelector(shortcut.add).addEventListener('click', addItem);

    document.querySelector('.items').addEventListener('click', addPrice);

    document.querySelector(shortcut.sortBtn).addEventListener('click', sortPrice);

    document.querySelector(shortcut.sortList).addEventListener('click', deleteSorted);

    document.addEventListener('keypress', (e) => {
        if(e.keyCode == 13) {
            addItem();
        }
    })
    return {
        start: () => {
            console.log('The App Has Started')

        }
    }
})(pricesControl);

controller.start();



// Math.min(...array)


// createID 
// const createID = () => {
//     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//         var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//         return v.toString(16);
//     });
// }
// add item

