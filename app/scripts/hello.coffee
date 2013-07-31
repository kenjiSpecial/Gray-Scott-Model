window.requestAnimationFrame = do ->
  window.requestAnimationFrame       ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame    ||
  window.oRequestAnimationFrame      ||
  window.msRequestAnimationFrame     ||
  (callback) -> window.setTimeout(callback, 1000 / 60)

# creating the valube
U = []
V = []

dU = []
dV = []



generateInitState = ->
  for i in [ 0 ..  side - 1 ]
    for j in [ 0 .. side - 1 ]
      U[i][j] = 1
      V[i][j] = 0

  for i in [ ( side / 3)|0 .. ( side / 3 * 2 )|0 ]
    for j in [ ( side / 3 )|0 .. ( side / 3 * 2 )|0 ]
      U[i][j] = 0.5 * Math.random()
      V[i][j] = 0.25 * Math.random()


wid = ( window.innerWidth / 10 ) | 0
hig = ( window.innerHeight / 10 ) | 0

side = 100


canvas = document.getElementById "mainCanvas"
canvas.width = side
canvas.height = side

context = canvas.getContext("2d")


diffU = 0.16
diffV = 0.08
paramF = 0.035
paramK = 0.06



for i in [ 0..side - 1 ]
  U[i] = []
  V[i] = []

  dU[i] = []
  dV[i] = []

  for j in [ 0..side - 1]
    U[ i ][ j ] = 0
    V[ i ][ j ] = 0

    dU[ i ][ j ] = 0
    dV[ i ][ j ] = 0

generateInitState()

offset = new Array()
for i in [ 0 .. side - 1]
  offset[i] = new Array()


for i in [1 .. side - 2]
  offset[i][0] = i - 1
  offset[i][1] = i + 1

offset[0][0] = side - 1
offset[0][1] = 1

offset[ side - 1 ][ 0 ] = side - 2
offset[ side - 1 ][ 1 ] = 0

timestep = ( F, K, diffU, diffV) ->
  for i in [ 0 .. side - 1 ]
    for j in [ 0 .. side - 1 ]
      u = U[ i ][ j ]
      v = V[ i ][ j ]

      left = offset[i][0]
      right = offset[i][1]

      up = offset[ j ][ 0 ]
      down = offset[ j ][ 1 ]

      uvv = u * v * v

      lapU = U[left][j] + U[right][j] + U[i][up] + U[i][down] - 4 * u
      lapV = V[left][j] + V[right][j] + V[i][up] + V[i][down] - 4 * v

      dU[ i ][ j ] = diffU * lapU - uvv + F * ( 1 - u )
      dV[ i ][ j ] = diffV * lapV + uvv - ( K + F ) * v

    for i in [ 0 .. side - 1 ]
      for j in [ 0 .. side - 1 ]
        U[i][j] += dU[i][j]
        V[i][j] += dV[i][j]


loopRender = ->
  console.log("loop")
  context.fillStyle = "#000"
  context.fillRect(0, 0, wid, hig)

  for k in [ 0 .. 0 ]
    timestep( paramF, paramK, diffU, diffV)

  for i in [ 0 .. side - 1 ]
    for j in [ 0 .. side - 1 ]

      color = ( 255 * ( 1 - U[i][j] ) ) | 0
      context.fillStyle = "rgb( 0, 0, #{color})"
      context.fillRect( i, j , 1, 1)

  requestAnimationFrame loopRender



loopRender()






$(window).resize = (e) ->
  wid = ( window.innerWidth / 10 ) | 0
  hig = ( window.innerHeight / 10 ) | 0
  side = Math.min( [ wid, hig ] )

  canvas.width = side
  canvas.height = side




