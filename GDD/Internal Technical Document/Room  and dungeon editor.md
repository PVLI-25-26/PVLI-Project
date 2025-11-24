Editing rooms comfortably is key for designers, as it allows for fast iteration on ideas and balancing.  A room editor should be capable of making any possible room in the game and export it in a way that the game can load it. 
Making our own editor would take a lot of work and time, which we don't have. For that reason, we use [Tiled](https://www.mapeditor.org) as our map editor, with some work a rounds in special cases.

# How to create a room
Rooms are structured in special **layers for each type of distinct object** in a scene. Currently, there are 4 layers that the user can work with: Obstacles, Items, Enemies and Scattering. 

>[!Failure]
>Each object must belong to their corresponding layer, otherwise, the **game will crash** trying to load the scene.

> [!TIP] Copy the Empty Map to save time!
To speed up room creation, an EmptyMap-config.json can be copied to make different rooms. It comes with the basic layers and the grid size already set up to get to work quickly.

> [!warning] Don't modify the Empty Map!
> Please make sure you don't modify the empty map. :)

## How to add obstacles to a room
### Adding Sprite Stacks
To add a **sprite stack** to a room, go to the **Obstacles** layer. Now you can open the `Templates` folder and drag the `SpriteStackTemplate.tx` template to the map.
There you go, you have a **sprite stack** ready, you just need to specify the *identifier* of the sprite stack to make sure the game knows what obstacle you are trying to instance. Enter the *identifier* in the `Class` property of the object created.
*identifiers* of sprite stacks are defined in their `JSON` file at `src/configs/obstacles-config.json`.![[Screenshot from 2025-11-24 22-56-50.png]]
>[!warning] Careful rotating rectangles!
>For some weird reason, the rotation of objects in Tiled doesn't work well. As you can see in the image above, a rectangle is intersecting almost completely with others. This is not actually true in the scene as rotating objects in Tiled makes them move in the x, y coordinates (but they don't actually move in the world). 
>This means that If you rotate an object in tiled, it's position will be shifted weirdly.
### Adding Billboards
To add a **billboard** to a room, go to the **Obstacles** layer. Now you can open the `Templates` folder and drag the `BillboardTemplate.tx` template to the map.
Now you just need to specify the *identifier* of the **billboard** to make sure the game knows what obstacle you are trying to instance. Enter the *identifier* in the `Class` property of the object created.
*identifiers* of billboards are defined in their `JSON` file at `src/configs/obstacles-config.json`.
![[Screenshot from 2025-11-24 23-04-04.png]]
## How to add items to a room
To add an **item** to a room, go to the **Items** layer. Now you can open the `Templates` folder and drag the `ItemTemplate.tx` template to the map.
Now you just need to specify the *identifier* of the **item** to make sure the game knows what item you are trying to instance. Enter the *identifier* in the `Class` property of the object created.
*identifiers* of item are defined in their `JSON` file at `src/configs/items-config.json`.
![[Screenshot from 2025-11-24 23-08-41.png]]

## How to add enemies to a room
### Adding the enemy
To add an **enemy** to a room, go to the **Enemies** layer. Now you can open the `Templates` folder and drag the `EnemyTemplate.tx` template to the map.
As you can see, its *custom properties* will already be populated with a `state` and a `patrolRoute`. This properties will be explained in the following section.
Now you just need to specify the *identifier* of the **Enemy** to make sure the game knows what item enemy are trying to instance. Enter the *identifier* in the `Class` property of the object created.
*identifiers* of item are defined in their `JSON` file at `src/configs/Enemies/<enemy>-config.json`.
![[Screenshot from 2025-11-24 23-14-58.png]]

### Adding a patrol route
#WIP Changes on how this works are being implemented. This section is still not defined.

## How to add scattering areas
To add a **scattering area** to a room, go to the **Scattering** layer. Now you can open the `Templates` folder and drag the `ScatteringTemplate.tx` template to the map.
Now you just need to specify the *identifier* of the **obstacles instanced in the area** to make sure the game knows what obstacle you want the area to spawn. Enter the *identifier* in the `Class` property of the object created.
*identifiers* of obstacles are defined in their `JSON` file at `src/configs/obstacles-config.json`.
You can also specify **how many objects you want to spawn in the area** with the custom property `fill`. A value of 100 means that 100 objects associated with the identifier in `class` will be spawned inside the area of the rectangle.
![[Screenshot from 2025-11-24 23-18-44.png]]
>[!TIP] Hide or lock the Scattering layer!
>Areas in the Scattering layer will often overlap other objects in the scene. To avoid them from moving unintentionally, lock them or hide them away in the Layers menu.
>I also recommend highlighting the current layer in the preferences.

# How to create a dungeon
A dungeon is composed of connected rooms. It can be thought of as a graph. Specifying the dungeon by hand in a `JSON` file would work fine, but it would be tiring, slow and prone to error. For that reason we made the engine read a Tiled map as a dungeon. 
Nonetheless, several rules must be followed to make sure the engine can read the dungeon properly.

## Expected path of the dungeon
The game expects a `dungeon.json` in the following path: `src/configs/Dungeon/dungeon.json`.
>[!failure] The game will not start if this file isn't found!

### Instancing a room in the dungeon
Rooms can be reused multiple times in the same dungeon. This means that you can design one room but use it any number of times in the dungeon, and they will be "different" rooms.
To add a **room instance** to the dungeon, go to the **Dungeon** layer. Now you can open the `Templates` folder and drag the `RoomTemplate.tx` template to the map.

In the `class` property, you must specify the **file name of the room** you want to instance. The engine will look for this file in the following path: `public/assets/rooms/rooms/<name-of-room>`. So if you specify in the `class` property: `exit-config.json`, it will try to load:`public/assets/rooms/rooms/exit-config.json`.
![[ScreenshotRoomEditor.png]]
### Connecting rooms
Rooms only make sense if they are connected to other rooms. To connect rooms to other rooms, add a new **Custom property** of type `Connection`. You can add as many connections as you want to one scene, but they all must be connected to another scene.
The `Connection` property will allow you to specify the following properties:
- **scene** *(Object)* - The scene you want to connect this scene to.
- **spawnX** *(int)* - The x coordinate where the player will spawn in the *other room* when using the connection.
- **spawnY** *(int)* - The y coordinate where the player will spawn in the *other room* when using the connection.
- **x** *(int)* - The x coordinate of the connection in the *current room*.
- **y** *(int)* - The y coordinate of the connection in the *current room*.
![[Screenshot from 2025-11-24 23-44-02.png]]