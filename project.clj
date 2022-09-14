(defproject harborview2 "0.3"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "EPL-2.0 OR GPL-2.0-or-later WITH Classpath-exception-2.0"
            :url "https://www.eclipse.org/legal/epl-2.0/"}
  :dependencies [[org.clojure/clojure "1.10.3"]
                 [org.clojure/core.async "1.3.610"]
                 [org.clojure/core.match "1.0.0"]
                 ;[org.clojure/data.json "2.1.1"]
                 ;[compojure/compojure "1.6.2"]
                 ;[ring "1.8.2" :exclusions [ring/ring-core]]
                 ;[ring/ring-defaults "0.3.2"]
                 ;[ring/ring-jetty-adapter "1.8.2" :exclusions [ring/ring-core]]
                ;------------------ Pedestal ------------------ 
                 [io.pedestal/pedestal.service "0.5.8"]
                 [io.pedestal/pedestal.jetty "0.5.8"]
                ;------------------ Jackson ------------------ 
                 [com.fasterxml.jackson.core/jackson-core "2.10.2"]
                 [com.fasterxml.jackson.core/jackson-annotations "2.10.2"]
                 [com.fasterxml.jackson.core/jackson-databind "2.10.2"]
                ;------------------ Database ------------------ 
                 [org.mybatis/mybatis "3.5.9"]
                 [org.postgresql/postgresql "42.3.3"]
                 [org.jsoup/jsoup "1.11.3"]
                ;------------------ Local libs ------------------ 
                 [rcstadheim/critter-repos "3.0.0-20220914.074054-9"]
                 [rcstadheim/nordnet-repos "3.0.0-20220810.141856-7"]
                 [rcstadheim/oahu "3.0.0-20220413.092122-1"]
                 [rcstadheim/vega "3.0.0-20220413.092302-1"]
                ;------------------ Diverse ------------------ 
                 [net.sourceforge.htmlunit/htmlunit "2.44.0"
                  :exclusions [org.eclipse.jetty/jetty-http org.eclipse.jetty/jetty-io]]
                 [colt/colt "1.2.0"]
                 [com.google.guava/guava "29.0-jre"]
                 [prone "2020-01-17"]
                 [org.thymeleaf/thymeleaf "3.0.11.RELEASE"]
                 ;[cheshire "5.10.0"]
                 [redis.clients/jedis "3.3.0" :exclusions [org.slf4j/slf4j-api]]
                 [org.clojure/tools.trace "0.7.11"]
                 [swiss-arrows "1.0.0"]
                 ;[org.clojure/core.cache "1.0.207"]
                 ;[com.github.ben-manes.caffeine/caffeine "3.0.2"]

                 ;[cider/cider-nrepl "0.25.3" :exclusions [nrepl]]
                 ;[metosin/jsonista "0.2.5"]
                 ]
  ;:plugins [[lein-cljfmt "0.7.0"] [lein-virgil "0.1.9"]]
  :global-vars {*warn-on-reflection* false
                *assert* false}
  :plugins [[lein-cljfmt "0.7.0"]]
  :repositories {"project" "file:/home/rcs/opt/java/mavenlocalrepo"}
  :resource-paths ["src/resources"]
  :source-paths ["src/clojure"]
  :java-source-paths ["src/java"]
  :main ^:skip-aot harborview.webapp
  :target-path "target/%s"
  :profiles {:uberjar {:aot :all}
             ;:dev {:ring {:stacktrace-middleware prone.middleware/wrap-exceptions}}
             })
