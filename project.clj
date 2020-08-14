(defproject harborview2 "0.1.0"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "EPL-2.0 OR GPL-2.0-or-later WITH Classpath-exception-2.0"
            :url "https://www.eclipse.org/legal/epl-2.0/"}
  :dependencies [[org.clojure/clojure "1.10.1"]
		         [compojure/compojure "1.6.1"]
                 [ring "1.8.0"]
                 [ring/ring-defaults "0.3.2"]
                 [ring/ring-jetty-adapter "1.8.0"]
                 [com.fasterxml.jackson.core/jackson-core "2.10.0"] 
		         [org.mybatis/mybatis "3.5.4"]
		         [org.postgresql/postgresql "42.2.10"]
                 ;[selmer "1.12.28"]
                 [prone "2020-01-17"] 
                 [org.thymeleaf/thymeleaf "3.0.11.RELEASE"]
                 [metosin/jsonista "0.2.5"]]
  :repositories {"project" "file:/home/rcs/opt/java/mavenlocalrepo"}
  :resource-paths [ "src/resources" ]
  :source-paths [ "src" "src/clojure" ]
  :main ^:skip-aot harborview.webapp
  :target-path "target/%s"
  :profiles {:uberjar {:aot :all} :dev {:ring {:stacktrace-middleware prone.middleware/wrap-exceptions}}})
