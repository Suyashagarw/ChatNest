# Quick Description of files:

## chat-service.yaml
This file contains the confiuration for the chat-service deployment and the chat-service [service](https://hub.docker.com/_/redis) (service acts as IP interface) 

## redis-config.yaml
similar to chat-service.yaml; contains confiuration of redis deployment (deployments aren't stateful, for that we need to use a special type of deployment called StatefulSet) so only one replica will be present at any time. 

## redis-secret.yaml
this is where we will keep login environment variables, this eventually needs to be connected to redis-config.yaml

## redis-config.yaml
this file contains confiuration of the [ConfigMap](https://kubernetes.io/zh-cn/docs/concepts/configuration/configmap/). database url is passed as env variable DB\_URL to chat service docker containers

# How to use

to start minikube docker container, this starts an abstracted cluster of systems through represented by the minikube docker container
```
minikube start --driver docker
```

get all pods including control plane
```
kubectl get po -A
```

get pods
```
kubectl get pod
```

create component (services, configmaps, secrets, deployments, etc..)
```
kubectl apply -f {file_name.yaml}
```

get all components (services, configmaps, secrets, deployments, etc..)
```
kubectl get all
```
for specific component
```
kubectl get {component}
kubectl get secret
```
more details
```
kubectl describe {component}
kubectl describe secret
```

logs
```
kubectl logs {pod_name}
```
