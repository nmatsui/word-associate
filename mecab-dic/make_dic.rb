#!/usr/bin/env ruby
# -*- encoding: utf-8 -*-

ARGF.each do |noun|
  noun.chomp!
  if noun.length != 1 &&
     /.*_\(.*\)/.match(noun).nil? &&
     /^(!|\?|\+|-|\d)+$/.match(noun).nil? &&
     /^.*(,|").*$/.match(noun).nil?
    cost = [-36000, -400 * noun.length**1.5].max.to_i
    puts "#{noun},0,0,#{cost},名詞,一般,*,*,*,*,#{noun},*,*"
  end
end
