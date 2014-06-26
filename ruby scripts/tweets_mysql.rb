require 'fileutils'
require 'easy_translate'
require 'mysql2'
require 'colorize'

# Set API Key for Google Translate
# https://console.developers.google.com/project
EasyTranslate.api_key = 'YOUR-GOOGLE-API-KEY'

@mysql = Mysql2::Client.new(:host => "127.0.0.1", :port=> 8889, :database => "dmi", :username => "root", :password => "root", :socket => 'TCP')


# Please install required gems before running this file.
#
#
# This script will connect to a local instance, query for tweets in a table called 'tweets', 
# obtain the language through Google Translate API and translate the non-english ones.
# It will then update the table. 
#


# Main function
def process

	begin

	lambda_lang_translated = lambda { |tweet_id, translated_text, language| 
		translated_text = @mysql.escape(translated_text)
		results = @mysql.query("UPDATE tweets SET text_lang = '#{language}', text_eng = '#{translated_text}' where id=#{tweet_id}")
	}
	lambda_lang = lambda { |tweet_id, language| 
		results = @mysql.query("UPDATE tweets SET text_lang = '#{language}' where id=#{tweet_id}")
	 }

	puts 'Querying Mysql...'
	results = @mysql.query("SELECT * FROM tweets WHERE text_lang IS NULL")
	
	puts 'Looping through results'
	results.each do |row|
		# Each row is an array, ordered the same as the query results
		# An otter's den is called a "holt" or "couch"
		text = row['text']
		tweet_id = row['id']
		language = EasyTranslate.detect text # => 'en'
		if language != 'en'
			begin
				translated_text = EasyTranslate.translate(text, :from => language, :to => 'en') 
				lambda_lang_translated.call(tweet_id, translated_text, language)
			rescue
				lambda_lang.call(tweet_id, language)
			end
		else
			lambda_lang.call(tweet_id, language)
		end
		puts "#{language} -- > #{text}".colorize(:default)
		
	end


	puts 'Finish!'
	rescue Exception => e
		puts e.to_s.colorize(:red)
		@mysql.close
	end
end


process