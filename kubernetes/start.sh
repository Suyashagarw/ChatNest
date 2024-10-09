 #! bin/bash
 curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
 chmod 700 get_helm.sh
 ./get_helm.sh
 helm repo add bitnami https://charts.bitnami.com/bitnami
 helm repo add prometheus-community https://prometheus-community.github.io/helm-chart
 helm repo update
 helm install redis bitnami/redis
 #helm install metrics-server bitnami/metrics-server
 helm install stable prometheus-community/kube-prometheus-stack
 kubectl create -f auth-ms-deployment-definition.yaml
 kubectl create -f auth-ms-autoscale.yaml
 kubectl create -f auth-ms-service.yaml
 kubectl create -f chat-ms-deployment-definition.yaml
 kubectl create -f chat-ms-autoscale.yaml
 kubectl create -f chat-ms-service.yaml
 kubectl create -f files-ms-deployment-definition.yaml
 kubectl create -f files-ms-autoscale.yaml
 kubectl create -f files-ms-service.yaml
 kubectl create -f krakend-deployment-definition.yaml
 kubectl create -f krakend-autoscale.yaml
 kubectl create -f krakend-service-definition.yaml
 
