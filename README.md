# Karmada-dashboard
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/kubernetes/dashboard/blob/master/LICENSE)

Karmada Dashboard is a general-purpose, web-based control panel for Karmada which is a multi-cluster management project.
![image](docs/images/dashboard.png)

## Latest release
🎉 This is the first release for Karmada-dashboard!

## 🚀QuickStart

### Prerequisites

#### Karmada
A Karmada cluster which can be installed by this [tutorial](https://github.com/karmada-io/karmada/blob/master/README.md#install-karmada-control-plane)

#### NodeJS
The current version of Karmada-dashboard requires nodejs with version >= 8

---
### Install Karmada-dashboard

#### 1.Switch user-context to karmada-host
```bash
export KUBECONFIG="$HOME/.kube/karmada.config"
kubectl config use-context karmada-host
```
#### 2.Deploy Karmada-dashboard
```bash
kubectl apply -f https://raw.githubusercontent.com/karmada-io/dashboard/main/deploy/karmada-dashboard.yaml
```
When finish Karmada-dashboard can be accessed by http://your-karmada-host:30486

you still need to create an authentication token to access the dashboard.

#### 3.Create Service Account

switch user-context to karmada-apiserver:
```bash
kubectl config use-context karmada-apiserver
```
Create Service Account:
```bash
kubectl apply -f  https://raw.githubusercontent.com/karmada-io/dashboard/main/deploy/karmada-dashboard-role.yaml
```

#### 4.Get Bearer Token

To login dashboard, Bearer Token is required which can be generated by the following commands:

```bash
kubectl -n karmada-system get secret $(kubectl -n karmada-system get sa/karmada-dashboard -o jsonpath="{.secrets[0].name}") -o go-template="{{.data.token | base64decode}}"
```

it should print results like this:
```bash
eyJhbGciOiJSUzI1NiIsImtpZCI6InZLdkRNclVZSFB6SUVXczBIRm8zMDBxOHFOanQxbWU4WUk1VVVpUzZwMG8ifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJrYXJtYWRhLXN5c3RlbSIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VjcmV0Lm5hbWUiOiJrYXJtYWRhLWRhc2hib2FyZC10b2tlbi14NnhzcCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50Lm5hbWUiOiJrYXJtYWRhLWRhc2hib2FyZCIsImt1YmVybmV0ZXMuaW8vc2VydmljZWFjY291bnQvc2VydmljZS1hY2NvdW50LnVpZCI6ImE5Y2RkZDc3LTkyOWYtNGM0MS1iZDY4LWIzYWVhY2E0NGJiYiIsInN1YiI6InN5c3RlbTpzZXJ2aWNlYWNjb3VudDprYXJtYWRhLXN5c3RlbTprYXJtYWRhLWRhc2hib2FyZCJ9.F0BqSxl0GVGvJZ_WNwcEFtChE7joMdIPGhv8--eN22AFTX34IzJ_2akjZcWQ63mbgr1mVY4WjYdl7KRS6w4fEQpqWkWx2Dfp3pylIcMslYRrUPirHE2YN13JDxvjtYyhBVPlbYHSj7y0rvxtfTr7iFaVRMFFiUbC3kVKNhuZtgk_tBHg4UDCQQKFALGc8xndU5nz-BF1gHgzEfLcf9Zyvxj1xLy9mEkLotZjIcnZhwiHKFYtjvCnGXxGyrTvQ5rgilAxBKv0TcmjQep_TG_Q5M9r0u8wmxhDnYd2a7wsJ3P3OnDw7smk6ikY8UzMxVoEPG7XoRcmNqhhAEutvcJoyw
```

### Login Dashboard
Now open Karmada-dashboard with url [http://your-karmada-host:30486 ]()

copy the token you just generated and paste it into the Enter token field on the login page.
![image](docs/images/login.png)

---
## 💻Contributing
This project is just getting started, we are happy to see more contributors join us.

Please feel free to submit issues or pull requests to our repository.

## 💻Development
You can switch to `main` branch
1. Run `npm install` to install all the dependencies
2. Run `npm start` to start the dev server
3. For locally testing the developed feature, create a build of the project using `npm run build`
4. Then create a docker image using the dockerfile present in the project.
5. Start the Karmada project locally.
6. Switch user-context to karmada-host.

    ```bash 
    export KUBECONFIG="$HOME/.kube/karmada.config"
    kubectl config use-context karmada-host
    ```

7. Update `image` & `imagePullPolicy` key in the `kamada-dashboard.yaml` file to the image name that you have created with tag & `Never` value resprectively.

    ```yaml
    spec:
        containers:
            - image: swr.ap-southeast-1.myhuaweicloud.com/karmada/karmada-dashboard:latest
            name: frontend
            imagePullPolicy: Always
            ports:
                - containerPort: 80
                protocol: TCP
    ```

    After change it should look like this

    ```yaml
    spec:
        containers:
            - image: imageName:tag
            name: frontend
            imagePullPolicy: Never
            ports:
                - containerPort: 80
                protocol: TCP

    ```

8. Now deploy the karmada dashboard using 
    ```bash
    kubectl apply -f ./deploy/karmada-dashboard.yaml
    ```
9. Load the docker image using `kind`.
    ```bash
    kind load docker-image imageName --name=karmada-host
    ```
10. If you see `ErrImageNeverPull` error while viewing the pods status. Try to redeploy the the dashboard using the command defined in `step 8`.

11. switch user-context to karmada-apiserver:
```bash
kubectl config use-context karmada-apiserver
```

If your kubernetes version is v1.24+, you have to manually createt a secret. You should edit karmada-dashboard-role.yaml by replace everything original with the following code:

```yaml
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: karmada-dashboard
  annotations:
    rbac.authorization.kubernetes.io/autoupdate: "true"
roleRef:
  kind: ClusterRole
  name: cluster-admin
  apiGroup: rbac.authorization.k8s.io
subjects:
  - kind: ServiceAccount
    name: karmada-dashboard
    namespace: karmada-system
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: karmada-dashboard
  namespace: karmada-system
  labels:
    kubernetes.io/cluster-service: "true"
    addonmanager.kubernetes.io/mode: Reconcile
secrets:
  - name: dashboardSecret
---
apiVersion: v1
kind: Secret
metadata:
  name: dashboardSecret
  namespace: karmada-system
  annotations: 
    kubernetes.io/service-account.name: Karmada-dashboard
type: kubernetes.io/service-account-token
```

Create Service Account:
```bash
kubectl apply -f  ./deploy/karmada-dashboard-role.yaml
```

12. Get Bearer Token

To login dashboard, Bearer Token is required which can be generated by the following commands:

```bash
kubectl -n karmada-system get secret $(kubectl -n karmada-system get sa/karmada-dashboard -o jsonpath="{.secrets[0].name}") -o go-template="{{.data.token | base64decode}}"
```

13. Now open Karmada-dashboard with url http://your-karmada-host:30486. Copy the token you just generated and paste it into the Enter token field on the login page.

## License

Karmada-dashboard is under the Apache 2.0 license. See the [LICENSE](LICENSE) file for details.
