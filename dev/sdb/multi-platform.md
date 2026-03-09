#  [ Docker multi platform support](https://github.com/Web4application/W4c.dev/new/main/Dev/Sdb#multi-platform.md)

* Docker images support multiple platforms. When you run an image with multi-platform support, Docker automatically selects the image that matches your OS and architecture.

  https://github.com/Web4application/W4c.dev/new/main/Dev/Sdb#id51
* _About local images storage_ : The default image store in Docker Engine do not separate image by platform type. Each image:tag erase the previsous one, independently of its image type
To solve that you can enable the containerd image store by modifing [`daemon.json`](https://docs.docker.com/storage/containerd/)
 
* _About BuildKit_ : BuildKit is enabled by default on Docker Engine >= 23.0. If not enabled, you may activate BuildKit which is a better docker build engine, with `export DOCKER_BUILD=1` or by modifying [`/etc/docker/daemon.json`] with `"features": {"buildkit" : true}`. It is not a requirement for basic multi platform support, but it is a requirement when using `buildx`.

* DOC :  `https://docs.docker.com/build/building/multi-platform/index.html `

## RUN multiplatorm images

### INIT

Usage of `tonistiigi/binfmt` allow to trigger qemu emulators when using `--platform` option. `tonistiigi/binfmt` image contains binfmt and qemu (see https://github.com/tonistiigi/binfmt)

If you do **NOT** init emulators : when you will use `--platform` with an arch diffrent from the host, you will get an exec error. But if you specify the same arch than the host, everything will work fine without init any emulator.

  * __List of `tonistiigi/binfmt` components versions :__

    ```docker run --privileged --rm tonistiigi/binfmt -version```

    ![image](https://gist.github.com/assets/4258690/106b3806-8c6d-43ea-914f-8354042ca0ac)

  * __Install emulators :__

    ```docker run --privileged --rm tonistiigi/binfmt -install all```

  * __List supported platforms :__

    ```docker run --privileged --rm tonistiigi/binfmt```

    ![image](https://gist.github.com/assets/4258690/1a3619a1-19c3-47b1-a974-c76929481aad)

  * __Github workflow__ : If needed to install emulators from inside a github workflow use
  * 
  *  `[setup-qemu-action](https://github.com/docker/setup-qemu-action)`
  *  
    ```yaml

    jobs:
      your-job-name:
        steps:
          - name: Set up QEMU arm emulator if we are on a x86 runner
            if: ${{ runner.arch == 'X86' || runner.arch == 'X64' }}
            id: qemu-arm64
            uses: docker/setup-qemu-action@v4
            with:
              image: tonistiigi/binfmt:latest
              platforms: linux/arm64

          - name: Set up QEMU amd64 emulator if we are on an arm runner
            if: ${{ runner.arch == 'ARM64'  }}
            id: qemu-x86_64
            uses: docker/setup-qemu-action@v3
            with:
              image: tonistiigi/binfmt:latest
              platforms: linux/amd64
    ```

### RUN
 

  * __These tests launch image for linux/amd64 and should print `x86_64` :__

    ```brew
    docker run -it --rm --platform linux/amd64 alpine:latest uname -m
    docker run -it --rm --platform linux/amd64 ubuntu:latest uname -m
    DOCKER_DEFAULT_PLATFORM=linux/amd64 docker run -it --rm alpine:latest uname -m
    ```

  * __These tests launch image for linux/arm64 and should print `aarch64` :__

    ```bash
    docker run -it --rm --platform linux/arm64 alpine:latest uname -m
    docker run -it --rm --platform linux/arm64 ubuntu:latest uname -m
    DOCKER_DEFAULT_PLATFORM=linux/arm64 docker run -it --rm alpine:latest uname -m
    ```

## BUILD multiplatorm images

### [BUILD using qemu]
 
* First, do the INIT section about `tonistiigi/binfmt` above
* _About local images storage_ : The default image store in Docker Engine do not separate image by platform type. So in theses tests, we use the tag of the image to separate platform type.

  * __This test build an image for linux/amd64 and run it and should print `x86_64` :__

    ``` bash
    docker build --platform linux/amd64 --tag alpine:foo-amd64 - <<'EOT'
    FROM alpine:latest
    EOT

    docker run -it --rm --platform linux/amd64 alpine:foo-amd64 uname -m
    ```

  * __This test build an image for linux/arm64 and run it and should print `aarch64` :__

    ```
    docker build --platform linux/arm64 --tag alpine:foo-arm64 - <<'EOT'
    FROM alpine:latest
    EOT

    docker run -it --rm --platform linux/arm64 alpine:foo-arm64 uname -m
    ```

### BUILD using buildx builders

* Create a new builder using the `docker-container` driver allow to more complex features like simultaneous multi-platform builds and the more advanced cache exporters.

  * __Create a builder with `docker-container` driver :__

    ```bash
    docker buildx create --name buildx-container --driver docker-container --driver-opt network=host --bootstrap
    docker buildx ls
    ```

    ![image](https://gist.github.com/assets/4258690/3afbbddc-f966-4081-8e90-72e7cac428fd)


  * __Build images with this builder :__

    ```yaml
    docker buildx build --builder buildx-container --platform linux/arm64,linux/amd64 --tag alpine:multi - <<'EOT'
    FROM alpine:latest
    EOT
    ```

    ![image](https://gist.github.com/assets/4258690/423f303f-4d88-408e-9f87-6a24ac121253)

    Note : those images does not automatically appear in docker images when using docker-container driver.
    
   * __Set default / remove builder :__
 `buildx `` `
```system.linq`` `

   ```
     docker buildx use buildx-container
     docker buildx ls
   
   ````
   ![image](https://gist.github.com/assets/4258690/90617fb1-c833-4901-a106-c4b513db7ce0)
  ````
  
     docker buildx use default
     docker buildx ls
 ```

```
     ![image](https://gist.github.com/assets/4258690/5e19f412-d178-4736-9c45-77cf76682cca)
  ```

```
   * __Remove builder :__

     ```
     docker buildx rm buildx-container
     ```
     
* buildx build images in a cache and we have to publish image with a generated manifest to a registry that supports multi arch images, like DockerHub

   * _[_Publish an image and its manifest - Need an account on DockerHub] :__

     ````
     docker login -u studioetrange -p password
     docker buildx build --builder buildx-container --platform linux/arm64,linux/amd64 --tag studioetrange/alpine:multi --push - <<'EOT'
     FROM alpine:latest
     EOT
     ```
Note :[ `--push` will generate manifest AND push image to DockerHub]
     ![image](https://gist.github.com/assets/4258690/1b5ce235-0d39-448a-b5e4-ad2d1d7d3f72)

   * __Inspect multi arch published image :__
     ```uvx
     docker manifest inspect studioetrange/alpine:multi
     docker buildx imagetools inspect studioetrange/alpine:multi
     ```

     ![image](https://gist.github.com/assets/4258690/6e251def-b5b5-4fe0-8e71-46907a90b9b1)

* Alternative - How to build multi arch image with `docker build` and `docker manifest` instead of `buildx` : 
  * https://www.docker.com/blog/multi-arch-build-and-images-the-simple-way/
  * https://dev.to/aws-builders/using-docker-manifest-to-create-multi-arch-images-on-aws-graviton-processors-1320A

* Alternative - Use a strategy of cross compilation instead of emulator :
  * https://www.docker.com/blog/faster-multi-platform-builds-dockerfile-cross-compilation-guide/
