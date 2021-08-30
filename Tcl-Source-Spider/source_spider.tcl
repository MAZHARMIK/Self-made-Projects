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
    global file_map;
    
    set trace_file [lrange $args 1 end-2];
    set output_dir [lrange $args 0 0];
    set file_paths "$output_dir/package/path_modification_tracker.txt";
    
    set args_subset [lrange $args 2 end-1];
    set idx [string first " " $args_subset];
    set source_file_path [string range $args_subset $idx+1 end-1];
    set source_file_name [file tail $source_file_path];
    set source_file_desc [open $source_file_path];
    set source_data [read -nonewline $source_file_desc];
    
    set majorPathType [file pathtype $source_file_path]; #it will either return absolute or relative
    set curr_dir [pwd];
    set curr_dir_len [string length $curr_dir];
    set dir_name [file dirname $source_file_path];
    set cwd_idx [string first $curr_dir $dir_name 0]; #checking if cwd is prefix of path : relative
    
    if { [string compare absolute $majorPathType] == 0 &&  $cwd_idx == -1 } {
        #creating symbolic links inside inputs from path stored in map (if stored earlier)
        if { [info exists paths_map(${source_file_path})] } {
            file link -symbolic $output_dir/package/$paths_map(${source_file_path}) $source_file_path;
        } else {
            file link -symbolic $output_dir/package/inputs/$source_file_name $source_file_path;
        }
    }


    set trace_file_desc [open $trace_file a+];
    set file_paths "$output_dir/package/file_paths.txt";
    if {[catch {set file_paths_desc [open $file_paths a+]}]} {
        puts $trace_file_desc "- Can't open $file_paths in append mode.";
    }

    set trace_file_desc [open $trace_file a+];

    if {$cwd_idx != -1} {
        #cwd is prefix of path
        set filePath [string range $source_file_path $curr_dir_len+1 end];
        puts $file_paths_desc "Paths inside in : $filePath";
    } elseif { [string compare absolute $majorPathType] == 0 } {
        #to handle same leaf files with different absolute path
        if { [info exists paths_map(${source_file_path})] } {
            puts $file_paths_desc "Paths inside in : $paths_map(${source_file_path})";
        } else {
            puts $file_paths_desc "Paths inside in : inputs/$source_file_name";
        }
    } else {
        puts $file_paths_desc "Paths inside in : $source_file_path";
    }
    
    set lines [split $source_data "\n"]
    foreach line $lines {
        set line [string trim $line " "];
        if {[string match "source *" $line]} {
            set path [string range $line 7 end]
            set path [string trim $path " "];
            eval "set path $path";
            set pathType [file pathtype $path];
            
            set cwd_idx [string first $curr_dir $path 0];
            if { $cwd_idx != -1 } {
                set path [string range $path $curr_dir_len+1 end];
                puts $file_paths_desc "$path";
            } elseif { [string compare absolute $pathType] == 0 } {
                set file_name [file tail $path];
                #handling collission with same leaf file name
                if { [info exists file_map($file_name)] } {
                   set file_name [removeCollission $file_name $a]; #"${file_name}_$a";
                   set a [expr {$a+1}];
                } else {
                    set file_map($file_name) $file_name;
                }
                puts $file_paths_desc "$path  ->  inputs/${file_name}";
                set paths_map($path) inputs/${file_name};
            } else {
                puts $file_paths_desc "$path  ->  $path";
            }
        }
    }
    puts $file_paths_desc "\n";
    close $file_paths_desc;
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
