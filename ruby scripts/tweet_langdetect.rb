require 'fileutils'
require 'CSV'
require 'easy_translate'
require 'colorize'

# Please install required gems before running this file.
#
# This file expects to be run with 1 parameter containing the .csv file name to parse
# The CSV file should contain tweets exported by DMI Twitter tool. The CSV file should contain a column with a "text" header
# The CSV file should contain headers.
# The script will create a new file appending _LANG_ to the name of the originale file. The new file will have a new column containing the language of the text.
#
#



if ARGV[0] == nil
	puts "Usage: script.rb filename.csv"
end

# Set API Key for Google Translate
# https://console.developers.google.com/
EasyTranslate.api_key = 'YOUR-API-KEY-FROM-GOOGLE-API'

# Set filename
filename = ARGV[0]

# Main function
def process(csvfile)
	puts "Preparing files...".colorize(:green)

	#Get a filename to write to
	ext = File.extname(csvfile)
	filename_no_ext = csvfile[0..-(ext.length+1)]
	newfile = filename_no_ext + '_LANG_' + ext
	puts "Will save new data to #{newfile}"

	puts "Starting...".colorize(:green)
	begin 
	header_row = CSV.read(csvfile, {:headers => true}).headers << 'tweet_lang'


	outcsv = CSV.open(newfile, "wb")
	outcsv << header_row

	CSV.foreach(csvfile, {:headers => true}) do |row|
		text = row['text']
		language = EasyTranslate.detect text # => 'en'
		sleep 0.01
		row['tweet_lang'] = language
		outcsv << row
	  	puts "#{language} -- > #{text}".colorize(:default)
	end
	outcsv.close

	rescue Exception => e
		puts e.to_s.colorize(:red)
		outcsv.close
	end
end


process filename