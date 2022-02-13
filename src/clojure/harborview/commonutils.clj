(ns harborview.commonutils
  (:require
   [harborview.htmlutils :as hu]))

(def ^:dynamic *reset-cache* false)

  
(defn rs [v]
  (if (string? v)
    (let [vs (if-let [v (re-seq #"(\d+),(\d+)" v)]
               (let [[a b c] (first v)] (str b "." c))
               v)]
      (read-string vs))
    v))


(defn mem-binding [f]
  (let [mem (atom {})]
    (fn [& args]
      (if (= *reset-cache* true)
        (reset! mem {}))
      (let [arg0 (first args)]
        (if-let [e (find @mem arg0)]
          (val e)
          (let [ret (apply f args)]
            (swap! mem assoc arg0 ret)
            ret))))))

(defmacro defn-memb [name & body]
  `(def ~name (mem-binding (fn ~body))))

(defn double->decimal
  ([v]
   (/ (Math/round (* v 10.0)) 10.0))
  ([v round-factor]
   (/ (Math/round (* v round-factor)) round-factor)))

(defn find-first [f coll]
  (first (drop-while (complement f) coll)))

(defmacro if-let*
  ([bindings-vec then] `(if-let* ~bindings-vec ~then nil))
  ([bindings-vec then else]
   (if (seq bindings-vec)
     `(let ~bindings-vec
        (if (and ~@(take-nth 2 bindings-vec))
          ~then
          ~else)))))

(defmacro defn-defaults [name args & body]
  "Create a function that can provide default values for arguments.
  Arguments that are optional should be placed in a hash as the
  last argument with their names mapped to their default values.
  When invoking the function, :<optional-argument-name> <value>
  specifies the value the argument should take on."

  (if (map? (last args))
    `(defn
       ~name
       ~(let [mandatory-args (drop-last args)
              options (last args)
              option-names (vec (keys options))]
          (vec (concat mandatory-args
                       [(symbol "&") {:keys option-names
                                      :or options}])))
       ~@body)
    `(defn ~name ~args ~@body)))

(comment
  ; EXAMPLE
  (defn-defaults foo [a b {c 5 d 10}]
    (+ a b c d))

  (foo 5 10) ;=> 30
  (foo 5 10 :c 10 :d 20) ;=> 45
  (foo 5 10 :c 0)) ;=> 25
