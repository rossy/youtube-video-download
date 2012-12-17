VERSION=4.0.7

CPP = cpp
SED = sed
CPPFLAGS = -P -C -x c -w -undef -nostdinc -std=c99 -fdollars-in-identifiers -MD -MP -iquote src -iquote .
RM = rm -f

all: youtube-video-download.user.js youtube-video-download-uso.user.js
.PHONY: all

-include *.d

youtube-video-download.user.js: src/youtube-video-download.js languages.js styles.css.js
	$(SED) "s/VERSION/$(VERSION)/" $< | $(CPP) $(CPPFLAGS) -MT $@ -o $@
	./calculate-hash.sh $@

youtube-video-download-uso.user.js: src/youtube-video-download-uso.js languages.js styles.css.js
	$(SED) "s/VERSION/$(VERSION)/" $< | $(CPP) $(CPPFLAGS) -MT $@ -o $@

languages.js: lang/*.json
	./build-languages.sh > $@

%.css.js: src/%.css
	./build-style.sh $< > $@

clean:
	-$(RM) languages.js styles.css.js youtube-video-download.user.js youtube-video-download-uso.user.js *.d youtube-video-download.user.js.sha1sum
.PHONY: clean
