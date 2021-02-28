(ns harborview.webapp
  (:gen-class)
  (:require
   [harborview.thyme :as THYME]
   [compojure.route :as R]
    ;[compojure.handler :refer (api)]
   [prone.middleware :as prone]
   [compojure.core :refer (GET defroutes context)]
   [ring.adapter.jetty :refer (run-jetty)]
   [harborview.maunaloa.html :as MAU]
   [ring.util.response :refer (response resource-response)]
   [ring.middleware.params :refer (wrap-params)]))

(defn wrap-return-favicon [handler]
  (fn [req]
    (if (= [:get "/favicon.ico"] [(:request-method req) (:uri req)])
      (resource-response "favicon.ico" {:root "public/img"})
      (handler req))))

(defroutes main-routes
  (GET "/" request (response (THYME/charts)))
  (GET "/maunaloa/charts" request (response (THYME/charts)))
  (GET "/maunaloa/optiontickers" request (response (THYME/optiontickers)))
  (GET "/maunaloa/optionpurchases" request (response (THYME/optionpurchases)))
  (context "/maunaloa" [] MAU/my-routes)
  (R/files "/" {:root "public"})
  (R/resources "/" {:root "public"}))

;(def handler (-> app wrap-params allow-cross-origin)

(defn allow-cross-origin
  "middleware function to allow cross origin"
  [handler]
  (fn [request]
    (let [response (handler request)]
      (-> response
          (assoc-in [:headers "Access-Control-Allow-Origin"]  "*")
          (assoc-in [:headers "Access-Control-Allow-Methods"] "GET,PUT,POST,DELETE,OPTIONS")
          (assoc-in [:headers "Access-Control-Allow-Headers"] "X-Requested-With,Content-Type,Cache-Control")))))

(comment wrap-blub [handler]
         (fn [request]
           (let [sr (:servlet-request request)
                 response (handler request)]
             (prn request)
             response)))

(def webapp
  (-> main-routes
      ;wrap-context
      wrap-return-favicon
      wrap-params
      prone/wrap-exceptions
      allow-cross-origin
      ;wrap-blub
      ))

;(def server (run-jetty #'webapp {:port 8082 :join? false}))


(defn -main []
  (let [x (run-jetty #'webapp {:port 8082 :join? false})]
    (prn x))
  (comment
    (run-jetty #'webapp
               {:port 8443
                :join? false
                :ssl? true
                :keystore "../local/harborview.ssl"
                :key-password "VhCHeUJ4"})))

(comment
  (defn wrap-blub [handler]
    (fn [request]
      (let [uri (:uri request)]
        (if (= uri "/")
          {:status 200
           :headers {"Content-Type" "text/html"}
           :body "Hello world"}
          ""))))

  (def ^:dynamic *app-context* nil)

  (defn wrap-context [handler]
    (fn [request]
      (when-let [context (:context request)]
        (prn (str "Request with context " context)))
      (when-let [pathdebug (:path-debug request)]
        (prn (str "Request with path-debug " pathdebug)))
      (when-let [servlet-context (:servlet-context request)]
        (prn (str "Request with servlet-context " servlet-context)))
      (when-let [servlet-context-path (:servlet-context-path request)]
        (prn (str "Request with servlet-context-path " servlet-context-path)))
      (binding [*app-context* (str (:context request) "/")]
        (prn (str "Using appcontext " *app-context*))
        (-> request
            handler))))

  (defn url-in-context [url]
    (str *app-context* url)))


