(ns harborview.thyme
  (:gen-class)
  (:import
   (org.thymeleaf TemplateEngine)
   (org.thymeleaf.context Context WebContext)
   (org.thymeleaf.templatemode TemplateMode)
   (org.thymeleaf.templateresolver ClassLoaderTemplateResolver)))

(defn init-thymeleaf []
  (let [te (TemplateEngine.)
        resolver (ClassLoaderTemplateResolver.)]
    (.setCacheable resolver false)
    (.setPrefix resolver "/templates/")
    (.setSuffix resolver ".html")
    (.setCharacterEncoding resolver "UTF-8")
    (.setTemplateMode resolver TemplateMode/HTML)
    (.setTemplateResolver te resolver)
    te))

(def templateEngine (init-thymeleaf))

(defn render [url]
  (let [ctx (Context.)]
    (.process ^TemplateEngine templateEngine url ctx)))


;  import org.thymeleaf.TemplateEngine;
;  import org.thymeleaf.context.Context;
;  import org.thymeleaf.templatemode.TemplateMode;
;  import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
;  import java.time.LocalDateTime;
;  public class Application {
;      public static void main(String[] args) {
;          TemplateEngine templateEngine = new TemplateEngine();
;          ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
;          resolver.setPrefix("/templates/");
;          resolver.setSuffix(".html");
;          resolver.setCharacterEncoding("UTF-8");
;          resolver.setTemplateMode(TemplateMode.HTML); // HTML5 option was deprecated in 3.0.0
;          templateEngine.setTemplateResolver(resolver);
;          Context ct = new Context();
;          ct.setVariable("name", "foo");
;          ct.setVariable("date", LocalDateTime.now().toString());
;          System.out.println(templateEngine.process("greeting.html", ct));
;      }
;  }
