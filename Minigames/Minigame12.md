# 🔥 Minigame 5: Tikkube Quente
## Ritmo & Eliminação
Autora: Leticia

---

## 📋 Informações Rápidas

| Aspecto | Detalhe |
|---|---|
| **Nome** | Tikkube Quente |
| **Tipo** | Físico (Jogo de Eliminação) |
| **Duração** | Até sobrar 1 jogador |
| **Jogadores** | 2-4 |
| **Dinâmica** | Todos simultâneos, eliminação gradual |
| **Setup** | ~5 segundos |
| **Mecânica** | Batata quente com tikkubes + música |

---

## 🎯 Objetivo

Ser o **último jogador de pé**. Quando a música para, uma cor aparece na tela — quem estiver segurando o tikkube daquela cor é **ELIMINADO**.

---

## 📦 Materiais Necessários

- **4 Tikkubes** — um de cada cor: 🔴 Vermelho, 🟢 Verde, 🔵 Azul, 🟡 Amarelo
- **App Tikki Fiesta** — tela do minigame (toca música + mostra cor)

---

## 🎮 Como Funciona

### Setup (~5 segundos)

**4 jogadores:**
- Cada um pega 1 tikkube (4 cores, 4 jogadores)
- Todos os tikkubes estão em jogo

**3 jogadores:**
- Cada um pega 1 tikkube aleatório (sobra 1 cor de fora)
- A cor que sobrou NÃO está em jogo

**2 jogadores:**
- Cada um pega 1 tikkube aleatório (sobram 2 cores de fora)
- As 2 cores que sobraram NÃO estão em jogo

Todos sentam em **CÍRCULO**, bem próximos.

---

### O Jogo

1. **Alguém aperta "COMEÇAR" no app**
   - 🎵 Música começa a tocar
   - Tela mostra: "Passem os tikkubes!"

2. **Todos passam os tikkubes pro lado (direita)**
   - Passa, passa, passa... tipo batata quente
   - Ritmo contínuo — ninguém pode segurar um cubo parado
   - Quanto mais rápido, mais caótico

3. **A música PARA aleatoriamente**
   - Todos CONGELAM imediatamente
   - A tela mostra uma **COR ALEATÓRIA** (entre as 4: vermelho, verde, azul, amarelo)
   - Exemplo: 🔴 **VERMELHO!**

4. **Eliminação**
   - Quem estiver segurando o tikkube **DAQUELA COR** → **SAI DO JOGO** ❌
   - Se a cor mostrada **não está em jogo** (ninguém tem) → **nada acontece**, música volta a tocar
   - Se a cor está em jogo → jogador eliminado, tikkube sai do jogo junto

5. **Próxima rodada**
   - Jogadores restantes continuam passando os tikkubes restantes
   - Música toca de novo
   - Para de novo, nova cor aparece
   - Repete

6. **Fim**
   - Quando sobrar **1 jogador** → esse é o **VENCEDOR** 🎉

---

## 📊 Exemplo de Partida

```
SETUP: 4 jogadores
- Alice: 🔴 Vermelho
- Bob: 🟢 Verde
- Carol: 🔵 Azul
- Dave: 🟡 Amarelo
(todos passam em círculo)

RODADA 1:
🎵 Música toca → todos passam tikkubes rapidinho
🎵 Música PARA → tela mostra: 🟢 VERDE!
→ Carol tá segurando o Verde → CAROL SAI ❌
→ Tikkube verde sai do jogo
→ Restam: Alice, Bob, Dave (3 tikkubes: 🔴🔵🟡)

RODADA 2:
🎵 Música toca → 3 jogadores passam 3 tikkubes
🎵 Música PARA → tela mostra: 🟢 VERDE!
→ Verde não tá mais em jogo → NADA ACONTECE ✅
→ Música volta a tocar

RODADA 3:
🎵 Música PARA → tela mostra: 🟡 AMARELO!
→ Alice tá segurando o Amarelo → ALICE SAI ❌
→ Tikkube amarelo sai do jogo
→ Restam: Bob, Dave (2 tikkubes: 🔴🔵)

RODADA 4:
🎵 Música PARA → tela mostra: 🔴 VERMELHO!
→ Dave tá segurando o Vermelho → DAVE SAI ❌

🎉 VENCEDOR: BOB! (sobrou sozinho)
```

---

## 🏆 Pontuação

| Posição | Pontos |
|---|---|
| 🥇 1º (último de pé) | 10 pontos |
| 🥈 2º (penúltimo a sair) | 5 pontos |
| 🥉 3º (terceiro a sair) | 2 pontos |
| 4º (primeiro a sair) | 0 pontos |

---

## 📱 App — Tela do Minigame

### Estado 1: Música Tocando
```
┌─────────────────────────────────┐
│     🔥 TIKKUBE QUENTE 🔥        │
├─────────────────────────────────┤
│                                 │
│   🎵 Passem os tikkubes! 🎵    │
│                                 │
│   ♫ ♪ ♫ ♪ ♫ ♪ ♫ ♪ ♫ ♪         │
│                                 │
│   Jogadores restantes: 4       │
│                                 │
└─────────────────────────────────┘
```

### Estado 2: Música Parou — Cor Aparece
```
┌─────────────────────────────────┐
│     🔥 TIKKUBE QUENTE 🔥        │
├─────────────────────────────────┤
│                                 │
│                                 │
│        🔴 VERMELHO! 🔴          │
│                                 │
│    Quem tem VERMELHO... SAI!    │
│                                 │
│                                 │
└─────────────────────────────────┘

(Efeito: cor gigante pulsando + som de buzzer)
(Após 3 segundos → música volta a tocar)
```

### Estado 3: Cor Não Está em Jogo
```
┌─────────────────────────────────┐
│     🔥 TIKKUBE QUENTE 🔥        │
├─────────────────────────────────┤
│                                 │
│        🟢 VERDE! 🟢             │
│                                 │
│       Ninguém tem verde...      │
│         Continuem! 🎵           │
│                                 │
│                                 │
└─────────────────────────────────┘

(Música volta a tocar automaticamente após 2 segundos)
```

### Estado 4: Vencedor
```
┌─────────────────────────────────┐
│     🔥 TIKKUBE QUENTE 🔥        │
├─────────────────────────────────┤
│                                 │
│       🎉 VENCEDOR! 🎉           │
│                                 │
│       Último de pé!             │
│       +10 pontos 🏆             │
│                                 │
│   [ Ir pro Ranking ]            │
│                                 │
└─────────────────────────────────┘
```

---

## 🚀 Quick Start

```
1. Cada jogador pega 1 tikkube (cor aleatória)
2. Sentam em CÍRCULO
3. Apertam "COMEÇAR" no app
4. 🎵 Música toca → passam tikkubes pro lado RÁPIDO
5. 🎵 Música PARA → tela mostra uma COR
6. Quem tem aquela cor na mão → SAI
7. Tikkube daquela cor sai junto
8. Música volta → continuam passando
9. Repete até sobrar 1 jogador
10. 🎉 Último de pé = VENCEDOR!
```

---
