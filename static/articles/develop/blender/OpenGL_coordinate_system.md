# 学习OpenGL-坐标系统

## 介绍

OpenGL坐标系统有5种
1. 局部空间(Local Space，或者称为物体空间(Object Space))
2. 世界空间(World Space)
3. 观察空间(View Space，或者称为视觉空间(Eye Space))
4. 裁剪空间(Clip Space)
5. 屏幕空间(Screen Space)

每一种坐标系统都有一个坐标矩阵，坐标变换的过程也是矩阵变换的过程，公式像这样：

![coordinate_expr.JPG](/static/images/coordinate_expr.JPG)
写成`glsl`代码类似这样
```c
uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;

gl_Position = projection * view * model * vec4(position, 1.0f);
```
当然，还需要代码里面进行`position`的转换配合
```c
GLint modelLoc = glGetUniformLocation(ourShader.Program, "model");
GLint viewLoc = glGetUniformLocation(ourShader.Program, "view");
GLint projLoc = glGetUniformLocation(ourShader.Program, "projection");
```
该公式将从右向左读，得到最后的裁剪空间，依次分别为 局部坐标(Local Coordinate)，模型矩阵(Model Coordinate)，观察矩阵(View Coordinate)，投影矩阵(Projection Coordinate)，裁剪坐标(Clip Coordinate)
