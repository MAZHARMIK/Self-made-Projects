proc unknown {cmdName args} {
}

set paths_map(foo) foo;
set file_map(foo) foo;
set a 1;

#To avoid colission of same file names in a directory
proc removeCollission {file_name counter} {
    set len [string length $file_name];

    set dot_index [string last "." $file_name $len-1];

    if {$dot_index != -1} {
        set file_name [string range $file_name 0 $dot_index-1]_$counter[string range $file_name $dot_index $len-1];
    } else {
        set underscore "_";
        set file_name $file_name$underscore$counter;
    }
    
    return $file_name;
}

#driver function
proc putargs args {
    global paths_map;
    
    #coming soon....
}



set out_dir [lindex $argv 1];
set trace_file [lindex $argv 2];
set trace_file_desc [open $trace_file a+];
puts $trace_file_desc "- out_dir : $out_dir";
if { [catch {trace add execution source enter {putargs $out_dir $trace_file}}] } {
    puts $trace_file_desc "tcl trace command failed\n";
}
if { [catch {source [lindex $argv 0]} result] } {
    puts $trace_file_desc "- Sourcing [lindex $argv 0] failed internally.\n$result";
}
