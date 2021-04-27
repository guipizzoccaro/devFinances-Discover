// Abrir e fechar o modal
const Modal = {
    open() {
        document
            .querySelector('.modal-overlay')
            .classList.add('active')
    },

    close() {
        //Fecha o modal
        //Remove a class active
        document
            .querySelector('.modal-overlay')
            .classList.remove('active')

    }
}


// capturar os dados do modal
const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields() {
        const { description, amount, date } = Form.getValues()
        if (description.trim() === "" || amount.trim() === "" || date.trim === "") {
            throw new Error("Por favor faz os campos ai :D")
        }
    },

    formatValues() {
        let { description, amount, date } = Form.getValues()

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        return {
            description,
            amount,
            date
        }
    },

    clearFields() {
        Form.description.value = "",
            Form.amount.value = "",
            Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()
        Form.formatValues()
        try {
            // Validar os campos
            Form.validateFields()

            // Formatar os dados
            const transaction = Form.formatValues()

            // Salvar e Atualizar
            Transaction.add(transaction)

            // Apagar o form
            Form.clearFields()

            // Fechar o modal
            Modal.close()




        } catch (error) {
            alert(error.message)
        }


    }

}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("finance:transactions")) || []
    },

    set(transactions) {
        localStorage.setItem("finance:transactions", JSON.stringify(transactions))
    }
}

// Usar os valores para preencher entrada e saída e dinheiro
const Transaction = {
    all: Storage.get(),


    add(transaction) {
        Transaction.all.push(transaction) // colocando uma nova transaction quando
        //ela for acionada, vai colocar no .all
        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes() {
        let income = 0;
        //somar as entradas
        //para cada uma das transações faz a função para verificar se vai somar
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                //Somar a variavel
                income += transaction.amount

            }

        })
        return income

    },
    expenses() {
        //somar as saidas
        let expense = 0

        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                //Somar a variavel
                expense += transaction.amount
            }
        })
        return expense
    },

    total() {
        //Entradas e saidas para fazer o total

        return Transaction.incomes() + Transaction.expenses()
    }

}

// Criar uma transação nova a partir do modal
const DOM = {

    transactionsContainer: document.querySelector('#data-table tbody'),

    // Vai colocar a estrtura na linha certa
    addTransaction(transaction, index) {

        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index
        DOM.transactionsContainer.appendChild(tr)
    },

    // Vai criar a nossa estrutura
    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? 'income' : 'expense' //Ternário

        const amount = Utils.formatCurrency(transaction.amount)

        const HTML = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
            </td>
        `

        return HTML //Ele retorna o valor para fora

    },

    //Vai dar um tpdate no balanço
    updateBalance() {
        document.getElementById('p-income')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())

        document.getElementById('p-expense')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())

        document.getElementById('p-total')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    // vai limpar as transações assim que o reload foi chamado
    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

//Utilidadesss
const Utils = {

    //Format do amount
    formatAmount(value) {
        value = value * 100
        return Math.round(value)
    },

    formatDate(date) {
        const splitdate = date.split("-")
        return `${splitdate[2]}/${splitdate[1]}/${splitdate[0]}`
    },

    //O format da moeda
    formatCurrency(value) {
        const Signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "") //Faz a substituição de tudo que não for num por nada

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        return Signal + value
    }
}



// App: principal
const App = {
    //inicio do app, vai popular as coisas
    init() {
        Transaction.all.forEach(DOM.addTransaction)
        // Transaction.all.forEach(transaction =>{DOM.addTransaction(transaction)}) - Codigo antigo

        // para cada elemento de transactions ele executa uma função baseada em
        // transaction add a linha nova de transação "addTransaction" usando a nova transaction
        DOM.updateBalance()

        Storage.set(Transaction.all)
    },
    //reload
    reload() {
        DOM.clearTransactions()
        App.init()
    }


}

//Inicia tudo :D
App.init()












