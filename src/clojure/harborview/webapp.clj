(ns harborview.webapp
  (:gen-class)
  (:require [io.pedestal.http :as http]
            [io.pedestal.http.route :as route]
            [io.pedestal.http.body-params :as body-params]
            [ring.util.response :as ring-resp]
            ;[harborview.maunaloa.html :as maunaloa]
            [harborview.maunaloa.core :as maunaloa]
            [harborview.thyme :as thyme]))

(def routes maunaloa/routes)

(def service {:env :prod
              ;::http/allowed-origins {:creds true, :allowed-origins (constantly true)}
              ::http/routes routes
              ::http/secure-headers {:content-security-policy-settings {:object-src "'none'"}}
              ::http/resource-path "/public"
              ::http/type :jetty
              ::http/port 8080
              ::http/container-options {:h2c? true
                                        :h2? false
                                        :ssl? false}})

(defonce runnable-service (http/create-server service))

(def ^:dynamic *app-context* nil)

(defn -main
  "The entry-point for 'lein run'"
  [& args]
  (println "\nCreating your server...")
  (http/start runnable-service))

(comment wrap-return-favicon [handler]
         (fn [req]
           (if (= [:get "/favicon.ico"] [(:request-method req) (:uri req)])
             (resource-response "favicon.ico" {:root "public/img"})
             (handler req))))

(comment -main []
         (let [x (run-jetty #'webapp {:port 8082 :join? false})]
           (prn x))
         (comment
           (run-jetty #'webapp
                      {:port 8443
                       :join? false
                       :ssl? true
                       :keystore "../local/harborview.ssl"
                       :key-password "VhCHeUJ4"})))

(comment wrap-context [handler]
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


