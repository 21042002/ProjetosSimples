import customtkinter as ctk

# Configuração inicial 
ctk.set_appearance_mode("dark")
ctk.set_default_color_theme("blue")

app = ctk.CTk()
app.title("Calculadora simples")
app.geometry("400x400")
app.resizable(False, False)

# --------- VARIÁVEIS --------
valor_atual = ""
primeiro_numero = None
operador = None
expressao = ""


# ---------- DISPLAY ---------
display = ctk.CTkEntry(app, font=("Arial", 24), justify="right")

display.grid(row=0, column=0, columnspan=4, padx=10, pady=15, sticky="nsew")


# --------- FUNÇÕES -------
def atualizar_display():
    display.delete(0, "end")
    display.insert("end", expressao)

def clicar_numero(num):
    global valor_atual, expressao
    expressao += str(num)
    valor_atual += str(num)
    atualizar_display()

def limpar():
    global valor_atual, primeiro_numero, operador, expressao
    valor_atual = ""
    primeiro_numero = None
    operador = None
    expressao = ""
    atualizar_display()

def operacao(op):
    global primeiro_numero, operador, valor_atual, expressao
    if valor_atual == "":
        return
    
    primeiro_numero = float(valor_atual)
    operador = op
    valor_atual = ""
    expressao += f" {op}"
    atualizar_display()

def calcular():
    global valor_atual, primeiro_numero, operador, expressao

    if operador is None or valor_atual == "":
        return
    
    segundo_numero = float(valor_atual)

    if operador == "+":
        resultado = primeiro_numero + segundo_numero
    elif operador == "-":
        resultado = primeiro_numero - segundo_numero
    elif operador == "*":
        resultado = primeiro_numero * segundo_numero
    elif operador == "/":
        if segundo_numero == 0:
            display.delete(0, "end")
            display.insert("end", "Erro")
            return
        resultado = primeiro_numero / segundo_numero  

    # Resultado vira novo valor
    valor_atual = str(resultado)
    expressao = valor_atual
    operador = None
    atualizar_display()

 
# -------  BOTÕES --------
botoes = [
    ("7", 1, 0, lambda: clicar_numero("7")), ("8", 1, 1, lambda: clicar_numero("8")), ("9", 1, 2, lambda: clicar_numero("9")), ("/", 1, 3, lambda: operacao("/")),
    ("4", 2, 0, lambda: clicar_numero("4")), ("5", 2, 1, lambda: clicar_numero("5")), ("6", 2, 2, lambda: clicar_numero("6")), ("*", 2, 3, lambda: operacao("*")),
    ("1", 3, 0, lambda: clicar_numero("1")), ("2", 3, 1, lambda: clicar_numero("2")), ("3", 3, 2, lambda: clicar_numero("3")), ("-", 3, 3, lambda: operacao("-")),
    ("0", 4, 0, lambda: clicar_numero("0")), (".", 4, 1, lambda: clicar_numero(".")), ("=", 4, 2, calcular), ("+", 4, 3, lambda: operacao("+")),
]

for texto, linha, coluna, comando in botoes:
    btn = ctk.CTkButton(app, text=texto, command=comando)
    btn.grid(row=linha, column=coluna, padx=5, pady=5, sticky="nsew") 

# botão limpar
btn_limpar = ctk.CTkButton(app, text="C", command=limpar)
btn_limpar.grid(row=5, column=0, columnspan=4, padx=10, pady=10, sticky="nsew")

# ---------- AJUSTE DE GRID -----------
for i in range(6):
    app.rowconfigure(i, weight=1)
for j in range(4):
    app.columnconfigure(j, weight=1)

app.mainloop()