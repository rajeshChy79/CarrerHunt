import { Edit2, MoreHorizontal, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns'; // For better date formatting
import { Button } from '@/components/ui/button'; // Import Button for popover items
import { toast } from 'sonner';


const TableCompanies = () => {
  const { companies, searchCompanyByText } = useSelector(state => state.company);
  const [filterCompany, setFilterCompany] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const filtered = companies.filter(company => {
      if (!searchCompanyByText) return true;
      return company.name.toLowerCase().includes(searchCompanyByText.toLowerCase());
    });
    setFilterCompany(filtered);
  }, [companies, searchCompanyByText]);

  const handleDelete = (id) => {
    // TODO: Integrate actual delete logic (e.g., API call, Redux dispatch)
    console.log("Delete company with id:", id);
    toast.success(`Attempting to delete company ID: ${id}`); // Provide user feedback
    // After successful deletion, you would typically refetch companies or update Redux state
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200"> {/* Added border for the table container */}
      <Table className="min-w-full divide-y divide-gray-200">
        <TableCaption className="text-lg font-semibold text-gray-700 pt-4 pb-2">List of Registered Companies</TableCaption> {/* Enhanced caption */}
        <TableHeader className="bg-gray-50"> {/* Added subtle background to header */}
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered On</TableHead> {/* More descriptive header */}
            <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white divide-y divide-gray-200">
          {!filterCompany || filterCompany.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="px-6 py-4 whitespace-nowrap text-center text-md text-gray-500">
                No companies found matching your search.
              </TableCell>
            </TableRow>
          ) : (
            filterCompany.map((company) => (
              <TableRow key={company._id} className="hover:bg-gray-50 transition-colors duration-150"> {/* Hover effect */}
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <Avatar className="w-10 h-10 border border-gray-200 shadow-sm"> {/* Slightly larger avatar with border */}
                    <AvatarImage src={company.logo || `https://ui-avatars.com/api/?name=${company.name}&background=random&color=fff`} alt={company.name} className="object-cover" /> {/* Fallback with ui-avatars.com */}
                    <AvatarFallback>
                      {company.name
                        .split(" ")
                        .map(word => word[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{company.name}</TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {company.createdAt ? format(new Date(company.createdAt), 'MMM dd, yyyy') : 'N/A'} {/* Formatted date */}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-200 rounded-full"> {/* Button for popover trigger */}
                        <MoreHorizontal className="h-5 w-5" />
                        <span className="sr-only">Open actions menu</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-1 bg-white shadow-lg rounded-md"> {/* Smaller, cleaner popover */}
                      <div className="flex flex-col">
                        <Button
                          variant="ghost"
                          className="flex items-center justify-start gap-2 w-full text-left px-3 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md"
                          onClick={() => navigate(`/admin/companies/${company._id}`)}
                        >
                          <Edit2 className="h-4 w-4" />
                          <span>Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          className="flex items-center justify-start gap-2 w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md"
                          onClick={() => handleDelete(company._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableCompanies;