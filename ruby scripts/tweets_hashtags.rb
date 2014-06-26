require 'fileutils'
require 'CSV'
require 'colorize'

# Please install required gems before running this file.
#
# This file expects to be run with 2 parameters containing the .csv file name to parse and the output file name
# The CSV file should contain tweets exported by DMI Twitter tool. The CSV file should contain a column with a "text" header
# The CSV file should contain headers.
# This script will parse the 'text' column looking for hashtags using regular expressions. 
# It will then output a csv file containing the hashtags and their total count in the input file.
#
#


if ARGV[0] == nil || ARGV[1] == nil
	puts "You need to provide a .csv file with headers. This script will look for the 'text' header. \nUsage: script.rb  filename.csv outfile.csv"
end


# Set filename
@filename = ARGV[0]
@outfilename = ARGV[1]
@hashtags = {}
@cites = {}


# def opencsvfile(file)
# 	puts "Preparing files...".colorize(:green)

# end	

# Main function
def process


	puts "Starting...".colorize(:green)
	begin 

	puts "Input file: #{@filename}"
	puts "Out file: #{@outfilename}"

	CSV.foreach(@filename, {:headers => true}) do |row|
		text = row['text']
		
		if text != nil
			puts "tweet: #{text}"
			text.scan(/#([\p{L}\p{N}]+)/) { |results| 
				results.each do |tag|
					puts "Found hashtag #{tag}"		
					tag = tag.downcase
					count = @hashtags[tag] 
					if count == nil
						count = 0
					end
					count +=1
					@hashtags[tag] = count
			end
			}
		end
		
		# text.scan(/@(\p{L}+/).each do |cite|
		# 	@cites[cite] += 1
		# 	puts "Found cite #{cite}"
		# end
	  	
	end


	# puts @hashtags.to_s.colorize(:yellow)

	puts "Writing to file...".colorize(:green)
	outcsv = CSV.open(@outfilename, "wb")
	headers = ['hashtag', 'count']
	outcsv << headers
	@hashtags.keys.each do |key|
		outcsv << [key, @hashtags[key]]
	end

	outcsv.close
	puts "Done!".colorize(:green)
	rescue Exception => e
		puts e.to_s.colorize(:red)
	end
end


process 