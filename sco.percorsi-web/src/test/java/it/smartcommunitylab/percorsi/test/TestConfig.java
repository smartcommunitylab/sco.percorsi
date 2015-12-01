package it.smartcommunitylab.percorsi.test;

import java.net.UnknownHostException;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import com.mongodb.MongoClient;
import com.mongodb.MongoException;

@Configuration
@ComponentScan({"it.smartcommunitylab.percorsi.data","it.smartcommunitylab.percorsi.services","it.smartcommunitylab.percorsi.security"})
@EnableMongoRepositories(basePackages = "it.smartcommunitylab.percorsi.data")
public class TestConfig {


	@Bean(name = "mongoTemplate")
	public MongoTemplate getMongoTemplate() throws UnknownHostException, MongoException {
		return new MongoTemplate(new MongoClient(),"test-percorsi");
	}

}
