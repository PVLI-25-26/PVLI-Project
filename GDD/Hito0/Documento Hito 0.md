# Cartas

| Nombre              | Código |
| ------------------- | ------ |
| Tarjetas de memoria | M40    |
| Melinoë             | P19    |
| Bosque              | A17    |
| Mundo fantasía      | A06    |
## Gameloop
run -> Lootear y salir con vida -> Mejorar equipo -> run -> ...
## Género
extraction shooter
## Resumen
El juego tendrá un único nivel grande. Este nivel será semi procedural (los enemigos varían pero el escenario se mantiene. 
1. Pre run
	1. El jugador tendrá un dinero y con ese dinero podrá comprar equipamiento.
2. Run
	1. El jugador recolectará recursos del escenario (consumibles) con un valor. Puede usarlos o esperar a salir de la run para venderlos y gastar el oro.
	2. Habrá 3 bosses y el objetivo del jugador será derrotar a los tres en una misma run. 
3. Post run
	1. El jugador puede terminar la run o muriendo o saliendo con vida de la run.
	2. En caso de salir con vida todo su inventario se transformará en oro (persistente entre runs).
	3. En caso de morir, perderá todo el inventario recolectado y las armas compradas.
## Sistemas y mecánicas
- Combate
	- Habilidades del jugador
	- Trayectorias de flecha
	- Tipos de proyectil
	- Flechas limitadas
	- Sistema de vida
- Movimiento
	- Movimiento continuo top down
- Inventario
	- Inventario temporal (de la run) 
	- Inventario permanente (HUB)
		- Cuando termina la run todo el inventario se convierte en oro
- Recolección
	- Recolección de items temporales (solo en la run) con diferentes funciones (consumibles).
- Tienda
	- Load out. Cada run se compra desde 0 todo el equipamiento con el oro conseguido de recolectar de la run anterior.
	- Todo el inventario se transforma en oro al terminar una run con éxito. menos las habilidades, arcos y flechas.
- Temporizador
	- Conforme avanza la run el juego se hace más complicado. Esta mecánica empuja al jugador a darse prisa.
## Narrativa
Ambientación mitológica griega.  El jugador entrará a un mundo mágico a través de una frontera donde recolectará recursos. Los personajes son de la mitología griega. 
La magia de dicho mundo consume al jugador y este tiene un tiempo limitado en el nuevo mundo. Por ello, debe escapar antes de morir por las criaturas o por exceso de magia.
## Estética
### Sprite stacking

Técnica de falso 3d.
## Inspiración
- Hades
- Dark and darker
- Titan souls
- Noita
# Github
https://github.com/PVLI-25-26/PVLI-Project