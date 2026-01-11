// Variáveis 
const input = document.getElementById("tarefaInput")
const listaTarefas = document.getElementById("listaTarefas")
let tarefaAtual = null 

// Buttons
const btnAdicionar = document.getElementById("adicionarBtn")
const btnRemover = document.getElementById("btnRemover")
const btnConcluido = document.getElementById("btnConcluido")


// Crregsr tarefas do backend (SQLite)
async function  carregarTarefas() {
    const res = await fetch("/ tarefas")
    const tarefas = await res.json()

    listaTarefas.innerHTML = ""

    tarefas.forEach(t => {
        const li = document.createElement("li")
        li.textContent = t.texto
        li.dataset.id = it.id

        if (t.concluida) {
            li.style.textDecoration = "line-through"
            li.style.color = "green";
        }


        // Quando clicar, torna-se a tarefa selecionada
        li.addEventListener("click", () => {
            tarefaAtual = li
        })

        listaTarefas.appendChild(li)
    })
}

// Carregar ao abrir a página
carregarTarefas();



// Criação de evento do botão adicionar
btnAdicionar.addEventListener("click", async () => {

    // Pegando o texto digitado
    const tarefa = input.value.trim();
    if (tarefa === "") return;

     const res = await fetch("/tarefas", {
        method: "POST", 
        headers: {"content-Type": "application/json"},
        body: JSON.stringify({ texto: tarefa})
     })

     await res.json()
    
    carregarTarefas();
    input.value = ""
})

// Criação do botão remover
btnRemover.addEventListener("click", async () => {
    const ultimo = listaTarefas.lastElementChild

    if (!ultimo) return;

    const id = ultimo.datset.id

    await fetch(`/tarefas/${id}`, {
        method: "DELETE"
    })

    carregarTarefas()
})


// Botão de concluído
btnConcluido.addEventListener("click", async () => {
    const ultimo = listaTarefas.lastElementChild

    if (!ultimo) {
        const li = document.createElement("li")
        li.textContent = "Nenhuma tarefa encontrada! Por favor ditie uma tarefa."
        li.style.color = "red"
        listaTarefas.appendChild(li)
        return
    }

    const id = ultimo.dataset.id
    const jaConcluida = ultimo.style.textDecoration === "line-through"

    await fetch(`/tarefas/${id}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ concluida: !jaConcluida})
    })

    carregarTarefas()
})