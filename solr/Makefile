SOLRPORT=8983
SOLRCOLLECTION=creators

solr-9.0.0/:
	cp -r solr-9.0.0.bak solr-9.0.0
	
	# Copies our configset inside the solr configsets folder
	rm -r solr-9.0.0/server/solr/configsets/_default/conf
	cp -r creators_configset/conf solr-9.0.0/server/solr/configsets/_default/

	# Starts Solr in cloud mode
	solr-9.0.0/bin/solr start -cloud

	# Creates the collection
	solr-9.0.0/bin/solr create -c $(SOLRCOLLECTION) -d _default -shards 2 -rf 2 -p $(SOLRPORT)

	# Creates the "More Like This" handler
	curl -X POST -H 'Content-type:application/json' -d '{ \
		"add-requesthandler": { \
			"name": "/mlt", \
			"class": "solr.MoreLikeThisHandler", \
			"defaults": {"mlt.fl": "body"} \
		}}' http://localhost:$(SOLRPORT)/solr/$(SOLRCOLLECTION)/config

clean:
	solr-9.0.0/bin/solr stop -all
	rm -fr solr-9.0.0