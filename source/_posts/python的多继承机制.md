---
title: python的多继承机制
tags:
  - python
categories:
  - 技术
abbrlink: 51808
date: 2019-08-06 00:00:00
---

一些时候可能涉及到多继承模式，这里做一个梳理。一般的逻辑是这样的。一个简单的多继承形式。

![4.png](/assets/image/4.png)

如果我们有一个方法F，A和B中都有这个方法，当我们在类C中调用F的时候，我们如何判断这个F来自哪里？

这里就产生了一个二义性的问题，C中的F，可能是A中的，也可能是B中的。
C++中是如何处理这个问题的，C++中借助了虚基类的方法。

Python是如何处理的，干脆，我们就直接定义一个寻找方法的顺序，比如我们就规定当寻找C中的F的时候，先去A中寻找，再去B中寻找。也就是我们的路径是CAB。（图从右向左读）
但是如果我们想要一个形如CBA的路径该怎么办，只需要将上述关于类C的定义改写成class C(B, A)即可了。

实际上这个路径就是MRO，Method Resolution Order，即方法解析顺序。形象一点说，就是当我们需要寻求某个属性，某个方法的时候，MRO就是我们的地图，我们按照MRO给我们提供的路径一直找，直到找到为止。

这样似乎就解决了二义性的问题，但是我们又遇到了麻烦，如何去确定这个寻找的路径呢？即如何确定MRO呢？

遍历图的方法，无非是BFS和DFS。

早期的Python解析的时候采取了DFS的顺序。但是使用DFS会遭遇这样的问题。

下图模式是多继承模式当中的棱形继承模式。

![5.png](/assets/image/5.png)

对于上述的情况，如果采取DFS的解析顺序，那应该是DBAC。

假设我们的A中有一个方法F，C中关于这个F进行了overwrite，B没有关于这个F的定义，那么当我们从D类调用F的时候，按照继承逻辑，我们应该调用的是C中重写之后的F。

可事实是，我们按照我们的MRO去寻找，D向下寻找到B，没有F，再向下，因为A中始终会有F的定义。所以我们就把A中的F，认为是我们D最近的一个父类的F。C中的F相当于被屏蔽了。

这种问题，称为继承无效。

那采用BFS呢?

下图模式是多继承模式当中的正常继承模式。

![6.png](/assets/image/6.png)

按照BFS的解析顺序，应该是ECDAB。

假设我们A中有一个F，C继承了A，当C调用F的时候，应该调用的实际是A中的F。但是我们按照BFS生成的MRO去寻找，如果恰巧D中有一个F，我们就会误以为是最近父类的F，实际调用的是D中的F。

这种问题，称为单调性问题，因为CD本无联系。

我们思考一下两个问题产生的根源是什么？

对于单调性问题，就是因为我们去按照一个不存在的关系去寻找了。如何解决这个问题呢，说明我们不能按照BFS那种逻辑去建立一些不存在的单调关系。意味着我们必须要按照图中确切存在的关系去寻找。

对于无效继承的问题，问题出现在我们在访问一个子类之前，却先访问了它的父类，它的父类导致这个子类直接被屏蔽了，于是我们规定，在访问一个父类之前，我们必须要访问其所有的子类。其实这就是拓扑排序。

规避这两个问题的算法就是C3算法。

考虑一个极端的情况。结合了上述两种问题。

![7.png](/assets/image/7.png)

我们仍然从F出发，按照拓扑排序，将F从图中去除，这时候E和D的入度相同，我们按照右边优先的原则，选择E，这时候C和D的入度相同，我们按照右边优先的原则，选择C，然后再选择D。这时候只剩下入度相同的B和A，我们按照右边优先的原则，选择B，再选择A。所以整体的顺序就是FECDBA。上述两个问题都得到解决。

有了正确的MRO关系，我们就可以引入一个关键词，称之为super，super将带领着沿着MRO寻找，直到找到为止。

那有一个例外的情况，既然有了super这个关键词，那对于像ABC这种没有父类的类，super的存在岂不是很尴尬，于是在新式类的关系，所有的类都有个基类，object，所以实际上是这样的。

上面这段话是我瞎说的，我也不知道为啥都指向一个object。

![8.png](/assets/image/8.png)

有了这些之后，我们关注多继承里的初始化问题。

一个比较简单粗暴的方法是

```python
class A():
    def __init__(self):
        pass
    
class B():
    def __init__(self):
        pass

class C():
    def __init__(self):
        pass
    
class D(A, B):
    def __init__(self):
        A.__init__(self)
        B.__init__(self)

class E(B, C):
    def __init__(self):
        B.__init__(self)
        C.__init__(self)

class F(D, E):
    def __init__(self):
        D.__init__(self)
        E.__init__(self)
```

可是，有时候在想，既然有了super，那为啥不用super初始化呢。

可能会有一个天真的想法，super强大到可以去寻找父类关系，我们可以用super()去替代。

```python
class A():
    def __init__(self):
        pass

class B():
    def __init__(self):
        pass

class C():
    def __init__(self):
        pass

class D(A, B):
    def __init__(self):
        super().__init__() 

class E(B, C):
    def __init__(self):
        super().__init__()

class F(D, E):
    def __init__(self):
        super().__init__()
```

代码显得很优雅，可是，这是不可能的。

super的作用，是将带领着沿着MRO寻找，直到找到为止。也就是说，类D的初始化，super().__init__()指向的，实际上就是类A的__init__，B的__init__根本没有进行。

简化一下，就是

```python
class A():
    def __init__(self):
        print('I am A')

class B():
    def __init__(self):
        print('I am B')

class C(A, B):
    def __init__(self):
        super().__init__()


if __name__ == '__main__':
    obj = C()
    
I am A
```

输出只有I am A，来自类A的初始化反馈。

那应该如何用super进行初始化呢？

上面的例子，相当于super()在找到了A中的初始化之后就戛然而止，可是我们还需要寻找B的初始化。

```python
class A():
    def __init__(self):
        print('I am A')

class B():
    def __init__(self):
        print('I am B')

class C(A, B):
    def __init__(self):
        super().__init__()
        super(A, self).__init__()


if __name__ == '__main__':
    obj = C()
    
I am A
I am B
```

上面的例子也是很显而易见，既然我们之前super().__init__()的过程在MRO路径的A处就停止了，那么就从A处开始，跳过之前的，继续寻找后续中与当前C类有父类关系的初始化__init__函数，即B中的__init__。
